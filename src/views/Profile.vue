<template>
  <v-container fluid class="bg-brown-lighten-5">
    <v-card>
      <v-card-text>
        <v-card
          :title="user?.name + ' (' + user.position + ')' || 'Loading...'"
          :subtitle="user?.employee_id || 'Loading...'"
          class="text-white"
          image="../assets/background.png"
          flat
        >
        </v-card>
        <v-row class="mt-4">
          <v-col cols="6">
            <DetailRow :value="user?.company" :labels="'Company'"></DetailRow>
          </v-col>
          <v-col cols="6">
            <DetailRow :value="user?.division" :labels="'Division'"></DetailRow>
          </v-col>
          <v-col cols="6">
            <DetailRow
              :value="user?.department"
              :labels="'Department'"
            ></DetailRow>
          </v-col>
          <v-col cols="6">
            <DetailRow
              :value="user?.sub_department"
              :labels="'Sub Department'"
            ></DetailRow>
          </v-col>
          <v-col cols="6">
            <DetailRow
              :value="user?.mailing_email"
              :labels="'Email'"
            ></DetailRow>
          </v-col>
          <v-col cols="6">
            <DetailRow
              :value="user?.superior_name"
              :labels="'Superior Name'"
            ></DetailRow>
          </v-col>
          <v-divider class="my-2 mx-3"></v-divider>
          <v-col cols="12" class="py-0">
            <h3 class="text-deep-orange ml-1">Saved Signature:</h3>
          </v-col>
          <v-col cols="12" v-if="!signature">
            <v-btn
              color="orange-darken-4"
              variant="flat"
              class="ml-1"
              @click="showCanvas"
              >Create Signature</v-btn
            >
          </v-col>
          <v-col v-if="signature">
            <div>
              <img :src="signature" style="border: 1px solid" />
            </div>
            <v-btn
              v-if="!canvasVisible"
              class="ml-0"
              color="orange-darken-4"
              variant="flat"
              @click="showCanvas"
              >Update Signature</v-btn
            >
          </v-col>
          <v-col v-if="canvasVisible" class="pl-5">
            <div>
              <canvas
                ref="canvas"
                width="300"
                height="300"
                class="border"
                style="border: 2px solid"
              ></canvas>
            </div>
            <v-btn
              color="medium-emphasis"
              variant="outlined"
              @click="clearCanvas"
              class="ml-0"
              >Clear</v-btn
            >
            <v-btn
              color="medium-emphasis"
              variant="outlined"
              @click="closeCanvas"
              >Close</v-btn
            >
            <v-btn color="orange-darken-4" variant="flat" @click="submitCanvas"
              >Submit</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="signatureDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          Create Signature
          <v-btn icon @click="signatureDialog = false" density="compact">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          Please create new Signature by clicking Create Signature Button,
          create your signature in the new square pad and click Submit.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange-darken-4" text @click="signatureDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular
        color="orange-darken-4"
        size="64"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from "@/axios";
import { useAuthStore } from "../stores/authStore";
export default {
  data() {
    return {
      authStore: useAuthStore(),
      canvasVisible: false,
      signatureDialog: false,
      loading: false,
      canvasRef: null,
      user: {},
      signature: null,
      ctx: null,
      lastX: -1,
      lastY: -1,
      mouseDown: false,
    };
  },
  mounted() {
    this.fetchData();

    this.canvasRef = this.$refs.canvas;
    if (!this.canvasRef) return;

    this.ctx = this.canvasRef.getContext("2d");

    this.canvasRef.addEventListener("mousedown", this.onMouseDown);
    this.canvasRef.addEventListener("mouseup", this.onMouseUp);
    this.canvasRef.addEventListener("mousemove", this.onMouseMove);

    this.canvasRef.addEventListener("touchstart", this.onTouchStart);
    this.canvasRef.addEventListener("touchmove", this.onTouchMove);
    this.canvasRef.addEventListener("touchend", this.onMouseUp);
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        // Ambil data profil karyawan
        const response = await axios.get("/employees/profile");
        this.user = response.data.employee;

        // Setelah user.id ada, ambil tanda tangan
        if (this.user.signature) {
          const signatureResponse = await axios.get(
            `/media/signature/${this.user.id}`
          );

          // Simpan URL tanda tangan ke variabel
          this.signature = signatureResponse.data.data.url;
        } else {
          this.signatureDialog = true;
        }
        this.loading = false;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.loading = false;
      }
    },
    async submitCanvas() {
      this.loading = true;
      const canvas = this.$refs.canvas;
      if (canvas) {
        const base64Data = canvas.toDataURL("image/png");

        // Extract the actual base64 data by removing the prefix
        const parts = base64Data.split(",");
        const imageData = parts.length > 1 ? parts[1] : parts[0];

        // Convert base64 to Blob
        const byteString = atob(imageData);
        const mimeType = base64Data.split(";")[0].split(":")[1] || "image/png";

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeType });

        if (blob.size == 1704) {
          this.loading = false;
          return (this.signatureDialog = true);
        }

        // Create FormData
        const formData = new FormData();
        formData.append("media", blob, "signature.png");
        formData.append("type", "signature");

        // Upload to server
        try {
          const response = await axios.post("/media/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Save to user data
          const signaturePath = response.data.data.path;
          try {
            const saveResponse = await axios.patch(
              `/employees/${this.user.id}/signature`,
              {
                signature: signaturePath,
              }
            );
            this.closeCanvas();
            this.fetchData();
          } catch (saveError) {
            console.error("Save signature error:", saveError);
          }
        } catch (error) {
          console.error("Upload error:", error);
        }
      }
      this.loading = false;
    },
    showCanvas() {
      this.canvasVisible = true;
      this.$nextTick(() => {
        this.initCanvas();
      });
    },
    closeCanvas() {
      this.canvasVisible = false;
      this.clearCanvas();
    },
    clearCanvas() {
      if (this.ctx) {
        this.ctx.clearRect(
          0,
          0,
          this.$refs.canvas.width,
          this.$refs.canvas.height
        );
      }
    },
    drawLine(x, y, size = 4) {
      if (this.lastX === -1) {
        this.lastX = x;
        this.lastY = y;
      }

      this.ctx.strokeStyle = "#000";
      this.ctx.lineCap = "round";
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.lineWidth = size;
      this.ctx.stroke();
      this.ctx.closePath();

      this.lastX = x;
      this.lastY = y;
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
      this.lastX = -1;
      this.lastY = -1;
    },
    getMousePos(e) {
      const rect = this.canvasRef.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    onMouseDown(e) {
      this.mouseDown = true;
      const { x, y } = this.getMousePos(e);
      this.drawLine(x, y, 1);
    },
    onMouseUp() {
      this.mouseDown = false;
      this.lastX = -1;
      this.lastY = -1;
    },
    onMouseMove(e) {
      if (!this.mouseDown) return;
      const { x, y } = this.getMousePos(e);
      this.drawLine(x, y);
    },
    onTouchStart(e) {
      const touch = e.touches[0];
      const rect = this.canvasRef.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.drawLine(x, y, 2);
    },
    onTouchMove(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.canvasRef.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.drawLine(x, y, 2);
    },
    initCanvas() {
      this.canvasRef = this.$refs.canvas;
      if (!this.canvasRef) return;

      this.ctx = this.canvasRef.getContext("2d");

      this.canvasRef.addEventListener("mousedown", this.onMouseDown);
      this.canvasRef.addEventListener("mouseup", this.onMouseUp);
      this.canvasRef.addEventListener("mousemove", this.onMouseMove);
      this.canvasRef.addEventListener("touchstart", this.onTouchStart);
      this.canvasRef.addEventListener("touchmove", this.onTouchMove);
      this.canvasRef.addEventListener("touchend", this.onMouseUp);
    },
  },
};
</script>

<style>
canvas {
  touch-action: none;
}

.signature-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.signature-pad {
  width: 300px;
  height: 220px;
  border: 1px;
  background: white;
  border: 2px solid black;
}

button {
  margin: 10px;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
}
</style>
