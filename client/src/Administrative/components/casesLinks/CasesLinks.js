import Item from "../../../shared/components/Item/Item";
import "./CasesLinks.css";
import { AuthContext } from "../../../shared/context/auth";
import { useContext, useEffect, useState } from "react";

const CasesLinks = () => {
  const { type, user } = useContext(AuthContext);
  const [perms, setPerms] = useState(null);

  useEffect(() => {
    if (type === "Admin" && user?.job?.permissions) {
      setPerms(user.job?.permissions);
    }
  }, [type, user]);

  let links;

  if (type === "Admin" && perms) {
    links = (
      <div className="cases-container-controls">
        {perms.cases.control && (
          <Item
            text="Manage"
            icon="fa-solid fa-file-pen"
            link="/admin/cases/manage"
          />
        )}
        {perms.cases.manage && (
          <Item
            text="New Case"
            icon="fa-solid fa-circle-plus"
            link="/admin/cases/new"
          />
        )}
        {perms.cases.view && (
          <Item
            text="Search"
            icon="fa-solid fa-magnifying-glass"
            link="/admin/cases"
          />
        )}
        {perms.caseTypes.view && (
          <Item
            text="Cases Structure"
            icon="fa-solid fa-clipboard-list"
            link="/admin/cases/structure"
          />
        )}
        {perms.caseTypes.manage && (
          <Item
            text="New case type"
            icon="fa-solid fa-file-circle-plus"
            link="/admin/cases/structure/new"
          />
        )}
      </div>
    );
  } else {
    links = (
      <div className="cases-container-controls">
        <Item
          text="Manage"
          icon="fa-solid fa-file-pen"
          link="/admin/cases/manage"
        />
        <Item
          text="Cases Structure"
          icon="fa-solid fa-clipboard-list"
          link="/admin/cases/structure"
        />
      </div>
    );
  }

  return <>{links}</>;
};

export default CasesLinks;
