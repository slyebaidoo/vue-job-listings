<script setup>
import router from "@/router";
import axios from "axios";
import { reactive } from "vue";
import { useToast } from "vue-toastification";
import API_BASE_URL from "@/api";

const form = reactive({
  type: "Full-Time",
  title: "",
  description: "",
  salary: "",
  location: "",
  company: {
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  },
});

const toast = useToast();

const handleSubmit = async () => {
  const newJob = {
    title: form.title,
    type: form.type,
    location: form.location,
    description: form.description,
    salary: form.salary,
    company: {
      name: form.company.name,
      description: form.company.description,
      contactEmail: form.company.contactEmail,
      contactPhone: form.company.contactPhone,
    },
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/jobs`, newJob);
    
    // Check if we're in production (using external API)
    if (import.meta.env.PROD) {
      toast.success("Job Add Request Sent (Note: External API is read-only - changes won't persist)");
    } else {
      toast.success("Job added successfully!");
    }
    
    // Handle response differently based on API
    if (response.data && response.data.id) {
      router.push(`/jobs/${response.data.id}`);
    } else {
      router.push('/jobs');
    }
  } catch (error) {
    console.error("Error adding job:", error);
    toast.error("Failed to add job. Please try again.");
  }
};
</script>

<template>
  <section class="bg-green-50">
    <div class="container m-auto max-w-2xl py-24">
      <div
        class="m-4 mb-4 rounded-md border bg-white px-6 py-8 shadow-md md:m-0">
        <form @submit.prevent="handleSubmit">
          <h2 class="mb-6 text-center text-3xl font-semibold">Add Job</h2>

          <div class="mb-4">
            <label for="type" class="mb-2 block font-bold text-gray-700"
              >Job Type</label
            >
            <select
              v-model="form.type"
              id="type"
              name="type"
              class="w-full rounded border px-3 py-2"
              required>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="mb-2 block font-bold text-gray-700"
              >Job Listing Name</label
            >
            <input
              v-model="form.title"
              type="text"
              id="name"
              name="name"
              class="mb-2 w-full rounded border px-3 py-2"
              placeholder="eg. Senior Vue Developer"
              required />
          </div>
          
          <div class="mb-4">
            <label for="description" class="mb-2 block font-bold text-gray-700"
              >Description</label
            >
            <textarea
              id="description"
              v-model="form.description"
              name="description"
              class="w-full rounded border px-3 py-2"
              rows="4"
              placeholder="Add any job duties, expectations, requirements, etc"
              required></textarea>
          </div>

          <div class="mb-4">
            <label for="salary" class="mb-2 block font-bold text-gray-700"
              >Salary</label
            >
            <select
              id="salary"
              v-model="form.salary"
              name="salary"
              class="w-full rounded border px-3 py-2"
              required>
              <option value="Under $50K">Under $50K</option>
              <option value="$50K - $60K">$50K - $60K</option>
              <option value="$60K - $70K">$60K - $70K</option>
              <option value="$70K - $80K">$70K - $80K</option>
              <option value="$80K - $90K">$80K - $90K</option>
              <option value="$90K - $100K">$90K - $100K</option>
              <option value="$100K - $125K">$100K - $125K</option>
              <option value="$125K - $150K">$125K - $150K</option>
              <option value="$150K - $175K">$150K - $175K</option>
              <option value="$175K - $200K">$175K - $200K</option>
              <option value="Over $200K">Over $200K</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="mb-2 block font-bold text-gray-700"> Location </label>
            <input
              type="text"
              v-model="form.location"
              id="location"
              name="location"
              class="mb-2 w-full rounded border px-3 py-2"
              placeholder="Company Location"
              required />
          </div>

          <h3 class="mb-5 text-2xl">Company Info</h3>

          <div class="mb-4">
            <label for="company" class="mb-2 block font-bold text-gray-700"
              >Company Name</label
            >
            <input
              type="text"
              v-model="form.company.name"
              id="company"
              name="company"
              class="w-full rounded border px-3 py-2"
              placeholder="Company Name"
              required />
          </div>

          <div class="mb-4">
            <label
              for="company_description"
              class="mb-2 block font-bold text-gray-700"
              >Company Description</label
            >
            <textarea
              id="company_description"
              v-model="form.company.description"
              name="company_description"
              class="w-full rounded border px-3 py-2"
              rows="4"
              placeholder="What does your company do?"
              required></textarea>
          </div>

          <div class="mb-4">
            <label
              for="contact_email"
              class="mb-2 block font-bold text-gray-700"
              >Contact Email</label
            >
            <input
              type="email"
              v-model="form.company.contactEmail"
              id="contact_email"
              name="contact_email"
              class="w-full rounded border px-3 py-2"
              placeholder="Email address for applicants"
              required />
          </div>
          
          <div class="mb-4">
            <label
              for="contact_phone"
              class="mb-2 block font-bold text-gray-700"
              >Contact Phone</label
            >
            <input
              type="tel"
              v-model="form.company.contactPhone"
              id="contact_phone"
              name="contact_phone"
              class="w-full rounded border px-3 py-2"
              placeholder="Optional phone for applicants" />
          </div>

          <div>
            <button
              class="focus:shadow-outline w-full rounded-full bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600 focus:outline-none"
              type="submit">
              Add Job
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>