const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const validateAction = async (courtId, role, perm, ssid) => {
  console.log(courtId);
  console.log(role);
  console.log(perm);
  console.log(ssid);
  if (role === "admin") {
    return true;
  }
  const FORM_DATA = {
    ssid: ssid,
    perm: perm,
  };
  try {
    const response = await fetch(
      `${REACT_APP_API_BASE_URL}/admin/court/action/auth/${courtId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FORM_DATA),
      }
    );

    const response_data = await response.json();
    if (response.ok === true) {
      return true;
    } else if (response.status === 401) {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

export const manageAction = async (courtId, perm, ssid, type) => {
  console.log(courtId);
  console.log(perm);
  console.log(ssid);
  console.log(type);

  const FORM_DATA = {
    ssid: ssid,
    perm: perm,
    type: type,
  };
  try {
    const response = await fetch(
      `${REACT_APP_API_BASE_URL}/admin/court/action/manage/${courtId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(FORM_DATA),
      }
    );

    const response_data = await response.json();
    if (response.ok === true) {
      return true;
    } else if (response.status === 404) {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};
