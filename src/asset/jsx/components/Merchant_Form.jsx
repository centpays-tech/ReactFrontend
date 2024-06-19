import React, { Component } from "react";

// component
import MessageBox from "./Message_box";

//SVG icons
import { LeftArrow, RightArrow, Reset, Close } from "../../media/icon/SVGicons";

class MerchantForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      messageType: "",
      token: localStorage.getItem("token"),
      isAddMerchantPanelOpen: this.props.isAddMerchantPanelOpen,
      companyInfo: true,
      businessInfo: false,
      directorInfo: false,  
      ...props.merchantData,
    };
  }

  componentDidUpdate(prevState) {
    if (
      prevState.isAddMerchantPanelOpen !== this.state.isAddMerchantPanelOpen
    ) {
      if (this.state.isAddMerchantPanelOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleBack = () => {
    const { businessInfo, directorInfo } = this.state;
    if (businessInfo) {
      this.setState({ companyInfo: true, businessInfo: false }, () => {});
    } else if (directorInfo) {
      this.setState({ businessInfo: true, directorInfo: false }, () => {});
    }
  };

  handleReset = () => {
    const { companyInfo, businessInfo, directorInfo } = this.state;

    if (companyInfo) {
      this.setState({
        companyName: "",
        userName: "",
        userEmail: "",
        phoneNo: "",
        postalCode: "",
        country: "",
        state: "",
        city: "",
        streetadd1: "",
        streetadd2: "",
        industriesId: "",
      });
    } else if (businessInfo) {
      this.setState({
        businessType: "",
        businessCategory: "",
        businessSubcategory: "",
        businnesRegisteredOn: "",
        merchantPayin: "",
        merchantPayout: "",
        turnover: "",
        websiteURL: "",
        settlementCharge: "",
        chargebackPercent: "",
      });
    } else if (directorInfo) {
      this.setState({
        firstName: "",
        lastName: "",
        skype: "",
      });
    }
  };

  handleSubmit = async (event) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    event.preventDefault();
    const {
      companyInfo,
      businessInfo,
      directorInfo,
      token,
    } = this.state;

    if (companyInfo) {
      this.setState({ companyInfo: false, businessInfo: true });
    } else if (businessInfo) {
      this.setState({ businessInfo: false, directorInfo: true });
    } else if (directorInfo) {
        const data = {
          company_name: this.state.companyName,
          username: this.state.userName,
          email: this.state.userEmail,
          phone_number: this.state.phoneNo,
          postal_code: this.state.postalCode,
          country: this.state.country,
          state: this.state.state,
          city: this.state.city,
          street_address: this.state.streetadd1,
          street_address2: this.state.streetadd2,
          industries_id: this.state.industriesId,
          business_type: this.state.businessType,
          business_category: this.state.businessCategory,
          business_subcategory: this.state.businessSubcategory,
          buiness_registered_on: this.state.businnesRegisteredOn,
          merchant_pay_in: this.state.merchantPayin,
          merchant_pay_out: this.state.merchantPayout,
          turnover: this.state.turnover,
          website_url: this.state.websiteURL,
          settlement_charge: this.state.settlementCharge,
          expected_chargeback_percentage: this.state.chargebackPercent,
          director_first_name: this.state.firstName,
          director_last_name: this.state.lastName,
          skype_id: this.state.skype,
        };
        console.log(data);
        try {
          const response = await fetch(`${backendURL}/clients`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          
          this.setState({ companyInfo: true, directorInfo: false });
          if (response.ok) {
            this.setState({
              errorMessage: "Data Submitted Successfully",
              messageType: "success",
              companyName: "",
              userName: "",
              userEmail: "",
              phoneNo: "",
              postalCode: "",
              country: "",
              state: "",
              city: "",
              streetadd1: "",
              streetadd2: "",
              industriesId: "",
              businessType: "",
              businessCategory: "",
              businessSubcategory: "",
              businnesRegisteredOn: "",
              merchantPayin: "",
              merchantPayout: "",
              turnover: "",
              websiteURL: "",
              settlementCharge: "",
              chargebackPercent: "",
              firstName: "",
              lastName: "",
              skype: "",
            });
          } else {
            this.setState({
              errorMessage: "Please fill all the fields",
              messageType: "fail",
            });
          }
        } catch (error) {
          this.setState({
            errorMessage: "Error submitting data",
            messageType: "fail",
          });
          console.log(error);
        }
    }
  };

  render() {
  const {handleAddMerchant} = this.props
    const {
      errorMessage,
    } = this.state;
    return (
      <>
        {errorMessage && (
          <MessageBox
            message={errorMessage}
            onClose={() => this.setState({ errorMessage: "" })}
          />
        )}
           
                <div className="overlay"></div>
                <div className="sendPanel">
                  <div className="sendPanel-header">
                    {" "}
                    <h5>Add New Merchant</h5>
                    <Close
                      className="icon"
                      onClick={() => handleAddMerchant(false)}
                    ></Close>
                  </div>
                  <div className="sendPanel-body add-merchant-body">
                    {/* {/ Company Info /} */}
                    {this.state.companyInfo && (
                      <div className="add-merchant-form">
                        <p className="p2">Company Info</p>
                        <form onSubmit={this.handleSubmit}>
                          <div className="add-merchant-form-top">
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="companyName"
                                className="inputFeild add-merchant-input"
                                value={this.state.companyName}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="companyName"
                                className="inputLabel"
                              >
                                Company Name
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="userName"
                                className="inputFeild add-merchant-input"
                                value={this.state.userName}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="userName" className="inputLabel">
                                Username
                              </label>
                            </div>

                            <div className="input-group add-merchant-input-group">
                              <input
                                type="email"
                                id="userEmail"
                                className="inputFeild add-merchant-input"
                                value={this.state.userEmail}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="password" className="inputLabel">
                                Email
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="phoneNo"
                                className="inputFeild add-merchant-input"
                                value={this.state.phoneNo}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="phoneNo" className="inputLabel">
                                Phone Number
                              </label>
                            </div>

                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="postalCode"
                                className="inputFeild add-merchant-input"
                                value={this.state.postalCode}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="postalCode"
                                className="inputLabel"
                              >
                                Postal Code
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="country"
                                className="inputFeild add-merchant-input"
                                value={this.state.country}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="country" className="inputLabel">
                                Country/Region
                              </label>
                            </div>

                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="state"
                                className="inputFeild add-merchant-input"
                                value={this.state.state}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="state" className="inputLabel">
                                State
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="city"
                                className="inputFeild add-merchant-input"
                                value={this.state.city}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="city" className="inputLabel">
                                City
                              </label>
                            </div>

                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="streetadd1"
                                className="inputFeild add-merchant-input"
                                value={this.state.streetadd1}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="streetadd1"
                                className="inputLabel"
                              >
                                Street Address
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="streetadd2"
                                className="inputFeild add-merchant-input"
                                value={this.state.streetadd2}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="streetadd2"
                                className="inputLabel"
                              >
                                Street Address 2
                              </label>
                            </div>

                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="industriesId"
                                className="inputFeild add-merchant-input"
                                value={this.state.industriesId}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="industriesId"
                                className="inputLabel"
                              >
                                Industries Id
                              </label>
                            </div>
                          </div>
                          <div className="add-merchant-form-bottom">
                          <button
                          className="add-merchant-panel-btn"
                              onClick={this.handleReset}
                            >
                              <Reset/>
                            </button>
                            <button type="submit" className="add-merchant-panel-btn">
                              <RightArrow/>
                            </button>
                            
                          </div>
                        </form>
                      </div>
                    )}
                    {/* {/ Business Info /} */}
                    {this.state.businessInfo && (
                      <div className="add-merchant-form">
                        <p className="p2">Business Info</p>
                        <form onSubmit={this.handleSubmit}>
                          <div className="add-merchant-form-top">
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="businessType"
                                className="inputFeild add-merchant-input"
                                value={this.state.businessType}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="businessType"
                                className="inputLabel"
                              >
                                Business Type
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="businessCategory"
                                className="inputFeild add-merchant-input"
                                value={this.state.businessCategory}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="businessCategory"
                                className="inputLabel"
                              >
                                Business Category
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="businessSubcategory"
                                className="inputFeild add-merchant-input"
                                value={this.state.businessSubcategory}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="businessSubcategory"
                                className="inputLabel"
                              >
                                Business Subcategory
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="date"
                                id="businnesRegisteredOn"
                                className="inputFeild add-merchant-input"
                                value={this.state.businnesRegisteredOn}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="businnesRegisteredOn"
                                className="inputLabel"
                              >
                                Business Registered On
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="merchantPayin"
                                className="inputFeild add-merchant-input"
                                value={this.state.merchantPayin}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="merchantPayin"
                                className="inputLabel"
                              >
                                Merchant Pay In
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="merchantPayout"
                                className="inputFeild add-merchant-input"
                                value={this.state.merchantPayout}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="merchantPayout"
                                className="inputLabel"
                              >
                                Merchant Pay Out
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="turnover"
                                className="inputFeild add-merchant-input"
                                value={this.state.turnover}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="turnover" className="inputLabel">
                                Turnover
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="websiteURL"
                                className="inputFeild add-merchant-input"
                                value={this.state.websiteURL}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="websiteURL"
                                className="inputLabel"
                              >
                                Website URL
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="settlementCharge"
                                className="inputFeild add-merchant-input"
                                value={this.state.settlementCharge}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="settlementCharge"
                                className="inputLabel"
                              >
                                Settlement Charge
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="chargebackPercent"
                                className="inputFeild add-merchant-input"
                                value={this.state.chargebackPercent}
                                onChange={this.handleInputChange}
                              />
                              <label
                                htmlFor="chargebackPercent"
                                className="inputLabel"
                              >
                                Expected Chargeback Percentage
                              </label>
                            </div>
                          </div>
                          <div className="add-merchant-form-bottom">
                            <button
                            className="add-merchant-panel-btn"
                              onClick={this.handleReset}
                            >
                              <Reset/>
                            </button>
                            <button
                            className="add-merchant-panel-btn"
                              onClick={this.handleBack}
                            >
                              <LeftArrow/>
                            </button>
                            <button type="submit" className="add-merchant-panel-btn">
                             <RightArrow/>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/*Director Info */}
                    {this.state.directorInfo && (
                      <div className="add-merchant-form">
                        <p className="p2">Director Info</p>
                        <form onSubmit={this.handleSubmit}>
                          <div className="add-merchant-form-top">
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="firstName"
                                className="inputFeild add-merchant-input"
                                value={this.state.firstName}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="firstName" className="inputLabel">
                                First Name
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="lastName"
                                className="inputFeild add-merchant-input"
                                value={this.state.lastName}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="lastName" className="inputLabel">
                                Last Name
                              </label>
                            </div>
                            <div className="input-group add-merchant-input-group">
                              <input
                                type="text"
                                id="skype"
                                className="inputFeild add-merchant-input"
                                value={this.state.skype}
                                onChange={this.handleInputChange}
                              />
                              <label htmlFor="skype" className="inputLabel">
                                Skype Id
                              </label>
                            </div>
                          </div>
                          <div className="add-merchant-form-bottom">
                            <button
                            className="add-merchant-panel-btn"
                              onClick={this.handleReset}
                            >
                              <Reset/>
                            </button>
                            <button
                            className="add-merchant-panel-btn"
                              onClick={this.handleBack}
                            >
                              <LeftArrow/>
                            </button>
                            <button type="submit" className="btn-primary">
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
      </>
    );
  }
}

export default MerchantForm;
