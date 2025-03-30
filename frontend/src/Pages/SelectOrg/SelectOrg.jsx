import React, { useEffect } from "react";
import { OrganizationSwitcher, useOrganization, useOrganizationList } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./SelectOrg.css";

const SelectOrgPage = () => {
  const navigate = useNavigate();
  const { isLoaded, organizationList } = useOrganizationList();
  const { organization } = useOrganization(); // Track selected org

  // Auto-redirect if only one org exists
  useEffect(() => {
    if (isLoaded && organizationList?.length === 1) {
      navigate(`/dashboard?orgId=${organizationList[0].organization.id}`);
    }
  }, [isLoaded, organizationList, navigate]);

  // Redirect when user selects an organization
  useEffect(() => {
    if (organization) {
      navigate(`/dashboard?orgId=${organization.id}`);
    }
  }, [organization, navigate]);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="select-org-container">
      <h1>Select an Organization</h1>
      <div className="org-switcher">
        <OrganizationSwitcher />
      </div>
    </div>
  );
};

export default SelectOrgPage;
