import React, { useEffect, useState } from "react";
import { OrganizationSwitcher, useOrganization, useOrganizationList } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./SelectOrg.css";

const SelectOrgPage = () => {
  const navigate = useNavigate();
  const { isLoaded, organizationList } = useOrganizationList();
  const { organization } = useOrganization(); // Track selected org

  const [selectedOrg, setSelectedOrg] = useState(null);

  // Auto-redirect if only one org exists
  useEffect(() => {
    if (isLoaded && organizationList?.length === 1) {
      navigate(`/dashboard?orgId=${organizationList[0].organization.id}`);
    }
  }, [isLoaded, organizationList, navigate]);

  // Handle organization selection
  useEffect(() => {
    if (organization) {
      setSelectedOrg(organization);
    }
  }, [organization]);

  // Redirect when user clicks "Go to Dashboard"
  const handleGoToDashboard = () => {
    if (selectedOrg) {
      navigate(`/dashboard?orgId=${selectedOrg.id}`);
    } else {
      alert("Please select an organization first.");
    }
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="select-org-container">
      <h1>Select an Organization</h1>
      <div className="org-switcher">
        <OrganizationSwitcher />
      </div>
      <div className="action-container">
        <button
          className="go-to-dashboard-button"
          onClick={handleGoToDashboard}
          disabled={!selectedOrg} // Disable button if no organization is selected
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SelectOrgPage;