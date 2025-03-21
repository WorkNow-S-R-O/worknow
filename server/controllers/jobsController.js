// controllers/jobsController.js
import { createJobService } from '../services/jobCreateService.js';
import { updateJobService } from '../services/editFormService.js';
import { deleteJobService } from '../services/jobDeleteService.js';
import { getJobsService} from '../services/jobService.js';
import { boostJobService } from '../services/jobBoostService.js';


export const createJob = async (req, res) => {
  const result = await createJobService(req.body);
  if (result.errors) return res.status(400).json({ success: false, errors: result.errors });
  if (result.error) return res.status(400).json({ error: result.error });
  
  res.status(201).json(result.job);
};

export const updateJob = async (req, res) => {
    const result = await updateJobService(req.params.id, req.body);
    if (result.error) return res.status(400).json({ error: result.error });
    if (result.errors) return res.status(400).json({ success: false, errors: result.errors });
    res.status(200).json(result.updatedJob);
  };

  export const deleteJob = async (req, res) => {
    const result = await deleteJobService(req.params.id);
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(200).json({ message: 'Объявление удалено' });
  };

  export const getJobs = async (req, res) => {
    const result = await getJobsService();
    if (result.error) return res.status(500).json({ error: result.error });
    res.status(200).json(result.jobs);
  };

  export const boostJob = async (req, res) => {
    const result = await boostJobService(req.params.id);
    if (result.error) return res.status(400).json({ error: result.error });
    res.status(200).json(result.boostedJob);
  };
  