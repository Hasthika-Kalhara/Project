import './Dashboard.css';

export default function Dashboard()
{
    return(
        <>
        <div className="navbar">
            <h2 className="nav-title">Cloud Sync Dashboard</h2>
            <div className="nav-links">
                <a href="/dashboard" className="nav-link">Dashboard</a>
                <a href="/settings" className="nav-link">Settings</a>
                <a href="/profile" className="nav-link">Profile</a>
                <a href="/logout" className="nav-link">Logout</a>
            </div>
        </div>
        </>
    )
}