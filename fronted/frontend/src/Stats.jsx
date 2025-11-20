// src/Stats.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./service/api";
import "./App.css";

function formatDate(dt) {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString();
}

export default function Stats() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLink = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/links/${code}`);
      setLink(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load link");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLink();
   
  }, [code]);

  const copyShortUrl = async () => {
    if (!link?.short_url) return;
    try {
      await navigator.clipboard.writeText(link.short_url);
      alert("Short URL copied to clipboard");
    } catch {
      alert("Copy failed — please select and copy manually");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this short link?")) return;
    try {
      await API.delete(`/api/links/${code}`);
      alert("Deleted");
      navigate("/"); 
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p style={{color:'red'}}>{error}</p></div>;

  return (
    <div className="container">
      <h1>Link Stats</h1>

      <div className="stat-card">
        <div className="stat-row">
          <span className="stat-label">Short URL</span>
          <a className="stat-value" href={link.short_url} target="_blank" rel="noreferrer">{link.short_url}</a>
          <button className="small-btn" onClick={copyShortUrl}>Copy</button>
        </div>

        <div className="stat-row">
          <span className="stat-label">Code</span>
          <span className="stat-value">{link.code}</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Original URL</span>
          <a className="stat-value" href={link.target_url} target="_blank" rel="noreferrer">{link.target_url}</a>
        </div>

        <div className="stat-row">
          <span className="stat-label">Total Clicks</span>
          <span className="stat-value">{link.click_count ?? 0}</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Last Clicked</span>
          <span className="stat-value">{formatDate(link.last_clicked)}</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Created At</span>
          <span className="stat-value">{formatDate(link.created_at)}</span>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <button className="btn" onClick={() => navigate("/")}>Back</button>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
