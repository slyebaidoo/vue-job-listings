<script setup>
import { RouterLink } from "vue-router";
import JobListing from "./JobListing.vue";
import jobData from "@/jobs.json";
import { ref, defineProps } from "vue";

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
});

const jobs = ref(jobData);
console.log(jobs.value);
</script>

<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl m-auto lg:container">
      <h2 class="mb-6 text-center text-3xl font-bold text-green-500">
        Browse Jobs
      </h2>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <JobListing
          v-for="job in jobs.slice(0, limit || jobs.length)"
          :key="job.id"
          :job="job"
        />
      </div>
    </div>
  </section>
  <section v-if="showButton" class="m-auto my-10 max-w-lg px-6">
    <RouterLink
      to="/jobs"
      class="block rounded-xl bg-black px-6 py-4 text-center text-white hover:bg-gray-700"
      >View All Jobs</RouterLink
    >
  </section>
</template>
