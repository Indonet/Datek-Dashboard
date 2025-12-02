<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      :custom-sort="customSort"
      class="elevation-1"
    />
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      status_type: 'all',
      items: [],
      sortBy: ['created_date'],
      sortDesc: [true], // default DESC
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'MyFlow ID', key: 'myflow_id' },
        { title: 'Subject', key: 'subject' },
        { title: 'Category', key: 'ctgr_name' },
        { title: 'Creator', key: 'creator' },
        { title: 'Next Approval', key: 'next_approval' },
        { title: 'Created Date', key: 'created_date', sortable: true },
        { title: 'Deadline', key: 'deadline' },
        { title: 'Status', key: 'status' },
      ],
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const requestBody = {
          type: this.status_type,
          page: 1,
          sorting: 'desc',
        }

        const response = await fetch('https://dev-memo.indonet.id/api/memo/list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data')
        }

        const data = await response.json()

        if (data.data) {
          this.items = data.data.map((item) => ({
            id: item.id,
            myflow_id: item.code,
            subject: item.subject,
            ctgr_name: item.ctgr_name,
            creator: item.creator_name,
            next_approval: item.next_approve,
            created_date: item.created_date || '-',
            deadline: item.deadline || '-',
            status:
              item.next_approve.length > 0 && item.status === 'process'
                ? 'need_approve'
                : item.status,
          }))
        }
      } catch (error) {
        console.error(error)
      }
    },

    customSort(items, sortBy, sortDesc) {
      if (!sortBy.length) return items

      return [...items].sort((a, b) => {
        const key = sortBy[0]
        const desc = sortDesc[0]

        let valA = a[key]
        let valB = b[key]

        if (key === 'created_date') {
          valA = valA && valA !== '-' ? new Date(valA) : new Date(0)
          valB = valB && valB !== '-' ? new Date(valB) : new Date(0)
        }

        if (valA < valB) return desc ? 1 : -1
        if (valA > valB) return desc ? -1 : 1
        return 0
      })
    },
  },
}
</script>
