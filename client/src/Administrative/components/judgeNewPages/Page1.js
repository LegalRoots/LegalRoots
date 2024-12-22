import Input from "../../../shared/components/FormElements/aydi/Input";
import Button from "../../../shared/components/Button2/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_EQUALLENGTH,
  VALIDATOR_MINLENGTH,
} from "../../../shared/util/validators";

const Page1 = ({
  formState,
  inputHandler,
  currentPageHandler,
  RadioHandler,
}) => {
  return (
    <div className="p1">
      <Input
        initialValue={formState.inputs["ssid"].value}
        initialValid={formState.inputs["ssid"].isValid}
        label="SSID"
        name="ssid"
        id="ssid"
        onInput={inputHandler}
        type="number"
        placeholder="enter the ssid"
        className="new-judge__input"
        errorMsg="invalid ssid"
        validators={VALIDATOR_EQUALLENGTH(9)}
      />

      <Input
        initialValue={formState.inputs["first_name"].value}
        initialValid={formState.inputs["first_name"].isValid}
        label="First Name"
        id="first_name"
        name="first_name"
        onInput={inputHandler}
        type="text"
        placeholder="the judges's first name"
        className="new-judge__input"
        errorMsg="invalid name"
        validators={VALIDATOR_MINLENGTH(2)}
      />
      <Input
        initialValue={formState.inputs["second_name"].value}
        initialValid={formState.inputs["second_name"].isValid}
        label="Second Name"
        id="second_name"
        name="second_name"
        onInput={inputHandler}
        type="text"
        placeholder="the judges's second name"
        className="new-judge__input"
        errorMsg="invalid name"
        validators={VALIDATOR_MINLENGTH(2)}
      />
      <Input
        initialValue={formState.inputs["third_name"].value}
        initialValid={formState.inputs["third_name"].isValid}
        label="Third Name"
        id="third_name"
        name="third_name"
        onInput={inputHandler}
        type="text"
        placeholder="the judges's third name"
        className="new-judge__input"
        errorMsg="invalid name"
        validators={VALIDATOR_MINLENGTH(2)}
      />
      <Input
        initialValue={formState.inputs["last_name"].value}
        initialValid={formState.inputs["last_name"].isValid}
        label="Last Name"
        id="last_name"
        name="last_name"
        onInput={inputHandler}
        type="text"
        placeholder="the judges's last name"
        className="new-judge__input"
        errorMsg="invalid name"
        validators={VALIDATOR_MINLENGTH(2)}
      />
      <div className="new-employee__radio">
        <label>Gender :</label>
        <div>
          <input
            type="radio"
            value="male"
            name="gender"
            id="genderMale"
            onChange={RadioHandler}
          />
          <label htmlFor="genderMale">Male</label>
        </div>
        <div>
          <input
            type="radio"
            value="female"
            name="gender"
            id="genderFemale"
            onChange={RadioHandler}
          />
          <label htmlFor="genderFemale">Female</label>
        </div>
      </div>
      <Input
        initialValue={formState.inputs["birthdate"].value}
        initialValid={formState.inputs["birthdate"].isValid}
        label="Birthdate"
        id="birthdate"
        name="birthdate"
        onInput={inputHandler}
        type="date"
        className="new-judge__input"
        errorMsg="invalid date"
      />
      <Input
        initialValue={formState.inputs["city"].value}
        initialValid={formState.inputs["city"].isValid}
        label="City"
        id="city"
        name="city"
        onInput={inputHandler}
        type="text"
        placeholder="your city"
        className="new-judge__input"
        errorMsg="invalid  city"
        validators={VALIDATOR_MINLENGTH(2)}
      />
      <Input
        initialValue={formState.inputs["address_st"].value}
        initialValid={formState.inputs["address_st"].isValid}
        label="Street/Area"
        id="address_st"
        name="address_st"
        onInput={inputHandler}
        type="text"
        placeholder="street name"
        className="new-judge__input"
        errorMsg="invalid  input"
        validators={VALIDATOR_MINLENGTH(2)}
      />
      <Input
        initialValue={formState.inputs["email"].value}
        initialValid={formState.inputs["email"].isValid}
        label="Email"
        id="email"
        name="email"
        onInput={inputHandler}
        type="email"
        placeholder="enter email"
        className="new-judge__input"
        errorMsg="invalid email address"
        validators={VALIDATOR_EMAIL()}
      />
      <Input
        initialValue={formState.inputs["phone"].value}
        initialValid={formState.inputs["phone"].isValid}
        label="Phone number"
        id="phone"
        name="phone"
        onInput={inputHandler}
        type="number"
        placeholder="enter phone number"
        className="new-judge__input"
        errorMsg="invalid phone number"
        validators={VALIDATOR_EQUALLENGTH(10)}
      />
      <Input
        initialValue={formState.inputs["password"].value}
        initialValid={formState.inputs["password"].isValid}
        label="Password"
        id="password"
        name="password"
        onInput={inputHandler}
        type="password"
        placeholder="insert a valid password"
        className="new-judge__input"
        errorMsg="password must be at least 8 character"
        validators={VALIDATOR_MINLENGTH(8)}
      />
      <div className="new-judge__button">
        <Button
          id="page1Btn"
          color="gold"
          size="2"
          type="button"
          onClick={currentPageHandler}
        >
          next
        </Button>
      </div>
    </div>
  );
};

export default Page1;
