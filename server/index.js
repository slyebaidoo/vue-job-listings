import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data', 'jobs.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read jobs from file
async function readJobs() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading jobs file:', error);
    return [];
  }
}

// Helper function to write jobs to file
async function writeJobs(jobs) {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(jobs, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing jobs file:', error);
    return false;
  }
}

// Routes

// GET /api/jobs - Get all jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await readJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/:id - Get single job
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const jobs = await readJobs();
    const job = jobs.find(j => j.id === req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// POST /api/jobs - Create new job
app.post('/api/jobs', async (req, res) => {
  try {
    const jobs = await readJobs();
    const newJob = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    jobs.push(newJob);
    const success = await writeJobs(jobs);
    
    if (success) {
      res.status(201).json(newJob);
    } else {
      res.status(500).json({ error: 'Failed to create job' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PUT /api/jobs/:id - Update job
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const jobs = await readJobs();
    const jobIndex = jobs.findIndex(j => j.id === req.params.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const updatedJob = {
      ...jobs[jobIndex],
      ...req.body,
      id: req.params.id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    jobs[jobIndex] = updatedJob;
    const success = await writeJobs(jobs);
    
    if (success) {
      res.json(updatedJob);
    } else {
      res.status(500).json({ error: 'Failed to update job' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE /api/jobs/:id - Delete job
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const jobs = await readJobs();
    const jobIndex = jobs.findIndex(j => j.id === req.params.id);
    
    if (jobIndex === -1) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const deletedJob = jobs.splice(jobIndex, 1)[0];
    const success = await writeJobs(jobs);
    
    if (success) {
      res.json({ message: 'Job deleted successfully', job: deletedJob });
    } else {
      res.status(500).json({ error: 'Failed to delete job' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});