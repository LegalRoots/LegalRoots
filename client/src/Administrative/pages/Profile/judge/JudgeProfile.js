import "./JudgeProfile.css";
import logo from "../../../../shared/assets/dummy.jpg";

const JudgeProfile = ({
  ssid,
  judge_id,
  first_name,
  second_name,
  third_name,
  last_name,
  address,
  gender,
  birthdate,
  phone,
  email,
  court_name,
  experience,
  qualifications,
  judge_photo,
  isValid,
}) => {
  return (
    <div className="judge-profile">
      <div className="profile-header">
        {!judge_photo ? (
          <img
            className="judge-photo"
            src={logo}
            alt={`${first_name} ${last_name}`}
          />
        ) : (
          <img
            className="judge-photo"
            src={
              judge_photo
                ? `data:image/jpeg;base64,${judge_photo}`
                : "default-photo.png"
            }
            alt={`${first_name} ${last_name}`}
          />
        )}
        <h2>{`${first_name} ${second_name} ${third_name} ${last_name}`}</h2>
      </div>
      <div className="profile-details">
        <div className="detail-group">
          <span className="label">SSID:</span>
          <span>{ssid}</span>
        </div>
        <div className="detail-group">
          <span className="label">Judge ID:</span>
          <span>{judge_id}</span>
        </div>
        <div className="detail-group">
          <span className="label">Gender:</span>
          <span>{gender}</span>
        </div>
        <div className="detail-group">
          <span className="label">Birthdate:</span>
          <span>{birthdate}</span>
        </div>
        <div className="detail-group">
          <span className="label">Phone:</span>
          <span>{phone}</span>
        </div>
        <div className="detail-group">
          <span className="label">Email:</span>
          <span>{email}</span>
        </div>
        <div className="detail-group">
          <span className="label">Court Name:</span>
          <span>{court_name.name}</span>
        </div>
        <div className="detail-group detail-group-smaller">
          <span className="label">Experience:</span>
          <span>{experience}</span>
        </div>
        <div className="detail-group detail-group-smaller">
          <span className="label">Qualifications:</span>
          <span>{qualifications}</span>
        </div>
        <div className="detail-group">
          <span className="label">Address:</span>
          <span>{`${address.city}, ${address.street}`}</span>
        </div>
        <div className="detail-group">
          <span className="label">Valid:</span>
          <span>{isValid ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
};

export default JudgeProfile;
