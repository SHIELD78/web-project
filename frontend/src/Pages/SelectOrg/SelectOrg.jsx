import React from "react";
import { OrganizationSwitcher, useOrganizationList } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectOrg.css";


const SelectOrgPage = () => {
    const navigate = useNavigate();
  const { isLoaded, organizationList } = useOrganizationList();

  useEffect(() => {
    if (isLoaded && organizationList && organizationList.length === 1) {
      navigate(`/dashboard?orgId=${organizationList[0].organization.id}`);
    }
  }, [isLoaded, organizationList, navigate]);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="select-org-container">
      <h1>Select an Organization</h1>
      <div className="org-switcher">
        <OrganizationSwitcher />
      </div>
    </div>
  );
}

export default SelectOrgPage;