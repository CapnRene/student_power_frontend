import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Button from '../common/Button';
import Pagination from '../common/Pagination';

const SchoolJobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const navigate = useNavigate();

  const fetchJobs = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await jobService.getJobs({ 
        page,
        limit: 10,
        status: 'active'
      });
      
      setJobs(response.data || []);
      setPagination({
        currentPage: response.data.pagination?.currentPage || 1,
        totalPages: response.data.pagination?.totalPages || 1,
        totalItems: response.data.pagination?.totalItems || 0
      });
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);
  
  const handlePageChange = (page) => {
    fetchJobs(page);
  };
  
  const handleViewJob = (id) => {
    navigate(`/jobs/${id}`);
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'expired': return 'bg-warning';
      case 'draft': return 'bg-info';
      case 'closed': return 'bg-secondary';
      default: return 'bg-primary';
    }
  };
  
  return (
    <div className="job-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Project Management</h2>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4">Loading jobs...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : jobs.length === 0 ? (
        <div className="alert alert-info">No jobs found.</div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Date Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.company?.name || 'Unknown'}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>
                      {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiration'}
                    </td>
                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleViewJob(job.id)}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default SchoolJobManagement;
