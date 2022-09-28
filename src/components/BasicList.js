import { useEffect, useState } from 'react';

import { client } from '../services/api-client';

export default function BasicList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { result } = await client('/api/now/table/incident?sysparm_limit=10');
      setData(result);
    };

    fetchData().catch(console.error);
  }, []);

  return (
    <>
      <h2>List of Incidents</h2>
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Caller</th>
            <th>Short Description</th>
            <th>Urgency</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((r) => (
              <tr key={r.sys_id}>
                <td>{r.number}</td>
                <td>{r.caller_id?.value}</td>
                <td>{r.short_description}</td>
                <td>{r.urgency}</td>
                <td>{r.state}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No Data Available</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
