import Item from "../../../shared/components/Item/Item";
import "./CasesLinks.css";

const CasesLinks = () => {
  return (
    <div className="cases-container-controls">
      <Item
        text="Manage"
        icon="fa-solid fa-file-pen"
        link="/admin/cases/manage"
      />
      <Item
        text="New Case"
        icon="fa-solid fa-circle-plus"
        link="/admin/cases/new"
      />
      <Item
        text="Search"
        icon="fa-solid fa-magnifying-glass"
        link="/admin/cases"
      />
      <Item
        text="Cases Structure"
        icon="fa-solid fa-clipboard-list"
        link="/admin/cases/structure"
      />
      <Item
        text="New case type"
        icon="fa-solid fa-file-circle-plus"
        link="/admin/cases/structure/new"
      />
    </div>
  );
};

export default CasesLinks;
