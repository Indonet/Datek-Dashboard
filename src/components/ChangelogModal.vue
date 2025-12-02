<template>
  <div>
    <div v-if="showModal" class="modal-backdrop" @click="closeOnBackdrop && closeChangelog()">
      <div class="modal-container" @click.stop>
        <div class="modal-header py-1 px-3">
          <h2 class="modal-title">Changelog</h2>
          <v-btn
            icon
            @click="closeChangelog"
            density="compact"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="modal-content">
          <div v-if="changelogEntries.length" class="changelog">
            <div v-for="(entry, index) in changelogEntries" :key="index" class="changelog-entry">
              <div class="changelog-date">{{ entry.date }}</div>
              <ul class="changelog-list">
                <li v-for="(change, idx) in entry.changes" :key="idx" class="changelog-item">
                  {{ change }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer pa-0">
          <v-btn
              variant="tonal"
              class="mr-2 bg-orange-darken-4"
              style="border: 2px solid white"
              @click="closeChangelog"
            >
              <span>Close</span>
            </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangelogModal',
  data() {
    return {
      showModal: false,
      changelogEntries: [],
      closeOnBackdrop: true
    };
  },
  created() {
    this.loadChangelog();
  },
  methods: {
    async loadChangelog() {
      try {
        const response = await fetch('/changelog/changelog.md');
        const content = await response.text();
        this.parseChangelog(content);
      } catch (error) {
        console.error('Failed to load changelog:', error);
      }
    },
    parseChangelog(content) {
      if (!content) return;

      const sections = content.split(/^## /m).filter(Boolean);

      this.changelogEntries = sections.map(section => {
        const lines = section.trim().split('\n');
        const date = lines[0].trim();

        const changes = lines
          .filter(line => line.trim().startsWith('- '))
          .map(line => line.trim().substring(2));

        return {
          date,
          changes
        };
      });
    },
    showChangelog() {
      this.showModal = true;
    },
    closeChangelog() {
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
.changelog-button {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.changelog-button:hover {
  background-color: #1565c0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-content {
  padding: 20px;
  overflow-y: auto;
  max-height: 70vh;
  flex-grow: 1;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

.modal-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: none;
  cursor: pointer;
  margin-left: 10px;
}

.modal-btn-primary {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

.changelog {
  width: 100%;
}

.changelog-entry {
  margin-bottom: 20px;
}

.changelog-date {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.changelog-list {
  margin: 0;
  padding-left: 20px;
}

.changelog-item {
  margin-bottom: 6px;
  line-height: 1.4;
}
</style>
