import { useState } from 'react';

import axios from '../services/rest-service';
import './BasicForm.css';

const INITIAL_FORM_DATA = { full_name: '', serno: '', agency: '', rank: '', deployed: false };

export default function BasicForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [result, setResult] = useState();
  const [error, setError] = useState();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/now/table/incident', formData);
      setResult(res.data);
      setFormData(INITIAL_FORM_DATA);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.error?.message || err.message);
    }
  };

  return (
    <>
      <h2>Incident</h2>
      <form onSubmit={handleSubmit}>
        <h3>Create New Incident</h3>
        {error ? (
          <div role="alert" className="usa-alert error">
            <p>
              <strong>An error has occurred</strong><br/>
              {error}
            </p>
          </div>
        ) : null}
        <label>
          Full Name:<br/>
          <input type="text" name="full_name" onChange={handleChange} value={formData.full_name} />
        </label>
        <label>
          Serno:<br/>
          <input type="text" name="serno" onChange={handleChange} value={formData.serno} />
        </label>
        <label>
          Agency:<br/>
          <input type="text" name="agency" onChange={handleChange} value={formData.agency} />
        </label>
        <label>
          Rank:<br/>
          <input type="text" name="rank" onChange={handleChange} value={formData.rank} />
        </label>
        <label>
          <input type="checkbox" name="deployed" onChange={handleChange} checked={formData.deployed} />
          <span>Deployed</span>
        </label>
        <footer>
          <button type="submit" className="usa-button primary">Submit</button>
        </footer>
      </form>
      { result ? (
        <div>
          <h3>Results</h3>
          <pre>{JSON.stringify(result, null, 4)}</pre>
        </div>
      ) : null }
    </>
  );
}