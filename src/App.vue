<template>
    <v-app id="inspire">
        <!-- <AppHeader></AppHeader> -->
        <v-main class="bg-brown-lighten-5">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </router-view>
        </v-main>
    </v-app>
</template>

<script>
// import { useRoute } from 'vue-router';

export default {
    name: 'App',
    data: () => ({
        // links: [
        //   { text: 'Dashboard', path: '/home' },
        //   { text: 'Create MyFlow', path: '/user' },
        //   { text: 'Services', path: '/services' },
        //   { text: 'Billing', path: '/billing' },
        // ],
        // activeTab: 0,
        // menu: false,
        // hints: true,
    }),
    mounted() {
        // Set active tab based on the current route
        // const route = useRoute();
        // const activeIndex = this.links.findIndex((link) => link.path === route.path);
        // if (activeIndex !== -1) {
        //   this.activeTab = activeIndex;
        // }
    },
    methods: {
		// getStatusClass(action) {
            
        //     const statusClasses = {
		// 		create: 'bg-yellow-darken-2 text-white px-2 py-1 rounded-full text-sm font-semibold',
		// 		process: 'bg-blue text-blue-700 px-2 py-1 rounded-full text-sm font-semibold',
		// 		rejected: 'bg-red text-red-700 px-2 py-1 rounded-full text-sm font-semibold',
		// 		revision: 'bg-purple text-purple-700 px-2 py-1 rounded-full text-sm font-semibold',
		// 		approved: 'bg-green text-white px-2 py-1 rounded-full text-sm font-semibold'
		// 	};
		// 	return statusClasses[action] || 'bg-gray text-gray-700 px-2 py-1 rounded-full text-sm font-semibold'; // Default warna
		// }
        getStatusClass(action) {
            const statusColors = {
                create: 'amber-darken-4',
                need_approve: 'amber-darken-4',
                process: 'blue',
                rejected: 'red',
                reject: 'red',
                revision: 'purple',
                update: 'deep-purple-darken-4',
                approved: 'green',
                approve: 'green',
                cancelled: 'blue-grey',
                cancel: 'blue-grey',
                my_memo: 'cyan',
                monitoring: 'black',
                all: 'brown-darken-1',
            };
            return statusColors[action] || 'gray'; // Default color jika tidak ditemukan
         }
	}
};
</script>

<style>
    .v-expansion-panel-text__wrapper {
        padding: 0px;
    }
    .v-toolbar__extension{
        height: 48px;
    }
	.v-card {
		scrollbar-width: thin; /* Firefox: Scrollbar lebih tipis */
	}

    .v-card-text {
		scrollbar-width: thin; /* Firefox: Scrollbar lebih tipis */
	}

	/* Chrome, Edge, Safari */
	.v-card::-webkit-scrollbar {
		width: 2px; /* Ubah ukuran scrollbar menjadi lebih tipis */
		height: 0; /* Menghindari horizontal scrollbar */
	}

	.v-card::-webkit-scrollbar-thumb {
		background: transparent; /* Warna thumb scrollbar */
		border-radius: 20px; /* Membuat scrollbar lebih smooth */
	}

	.v-card::-webkit-scrollbar-track {
		background: transparent; /* Transparan agar tidak terlihat */
	}
</style>
