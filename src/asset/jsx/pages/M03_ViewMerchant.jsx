import React, { Component } from "react";

//Components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
// import ApprovalRatioChart from "../components/ApprovalRatioChart";

// SVG Icons
import {
  LeftArrow,
  RightArrow,
  ApprovalRatio,
  CreaditCard,
  DollarCircle,
  LeftSign,
  RightSign,
  User,
  Id,
  URL,
  Industry,
  Phone,
  Email,
  Skype,
  Address,
  BusinessInfo,
  DirectorInfo,
  PendingUserIcon,
  MerchantRates,
  MerchantSettlements,
  Close,
} from "../../media/icon/SVGicons";

//Images and Icons
import profile from "../../media/icon/user-profile.png";
import settlemntimg from "../../media/image/siteWorking.jpg";
// import calender from "../../media/icon/calender.png";

class ViewMerchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebaropen: true,
      token: localStorage.getItem("token"),
      company_name: this.extractENameFromURL(),
      overviewData: [],
      ratesData: [],
      approvalData: [],
      volumeData: [],
      showApprovalRatio: true,
      showTotalVolume: false,
      showSettledVolume: false,
      overviewInfo: true,
      ratesInfo: false,
      settlementInfo: false,
      isAddMerchantPanelOpen: false,
      companyInfo: true,
      businessInfo: false,
      directorInfo: false,
      isEditing: false,
      isSuspended: false,
      // calendarVisible: false,
      // fromDate: "22/5/24",
      // toDate: "22/5/24"
    };
  }

  extractENameFromURL() {
    const currentPath = window.location.pathname;
    const companyName = currentPath.split("/viewmerchant/")[1];
    return companyName;
  }

  componentDidMount() {
    const {company_name} = this.state;
    let date = new Date().toISOString();
    date = date.split("T")[0]
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    this.fetchData(`${backendURL}/viewclient?company_name=${company_name}`,'overviewData');
    this.fetchData(`${backendURL}/approvalratio?merchant=${company_name}&fromDate=${date}&toDate=${date}`,'approvalData');
    this.fetchData(`${backendURL}/volumesum?company_name=${company_name}`,'volumeData');
  }

  fetchData = async (url, dataVariable) => {
    const { token } = this.state;
    try {
      const response = await fetch(
        url,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.setState({ [dataVariable]: data });
        console.log(data)
      } else {
        console.error("Error fetching data:", response.statusText);
        this.setState({
          errorMessage: "Error in Fetching data. Please try again later.",
          messageType: "fail",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "",
      });
    }
  };

  fetchRatesData = async () => {
    const { token, company_name } = this.state;
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    try {
      const response = await fetch(
        `${backendURL}/ratetables?company_name=${company_name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        let data = await response.json();
        this.setState({ ratesData: data });
      } else {
        console.error("Error fetching data:", response.statusText);
        this.setState({
          errorMessage: "Error in Fetching data. Please try again later.",
          messageType: "fail",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "",
      });
    }
  };

  formatValue = (val) => {
		return `${(val / 1000).toFixed(1)}k`;
	};

  getStatusText(status) {
    switch (status) {
      case "Active":
        return (
          <div
            className={`status-div ${
              this.state.isSuspended ? "pending-status" : "success-status"
            }`}
          >
            <p>{this.state.isSuspended ? "Inactive" : "Active"}</p>
          </div>
        );
      case "Inactive":
        return (
          <div
            className={`status-div ${
              this.state.isSuspended ? "pending-status" : "success-status"
            }`}
          >
            <p>{this.state.isSuspended ? "Inactive" : "Active"}</p>
          </div>
        );
      default:
        return "";
    }
  }

  // handleCalenderClick = () => {
  //   console.log("clicked");
  //   this.setState({
  //     calendarVisible: !this.state.calendarVisible,
  //   });
  // };

  handleInputChange = (event) => {
    const { id, value } = event.target;
    const { overviewData } = this.state;
    const updatedOverviewData = { ...overviewData, [id]: value };
    this.setState({ overviewData: updatedOverviewData });
  };

  handleSubmit = async (event) => {
    const backendURL = process.env.REACT_APP_BACKEND_URL;
    event.preventDefault();
    const { token, company_name, overviewData } = this.state;
    try {
      const response = await fetch(
        `${backendURL}/updateclient?company_name=${company_name}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(overviewData),
        }
      );

      if (response.ok) {
      } else {
        console.error("Error updating data:", response.statusText);
        this.setState({
          errorMessage: "Error in updating data. Please try again later.",
          messageType: "fail",
        });
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      this.setState({
        errorMessage: "An unexpected error occurred. Please try again later.",
        messageType: "",
      });
    }
  };

  handleReset = () => {
    this.setState({
      overviewData: {
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
      },
    });
  };

  handleBackArrowclick = (current) => {
    if (current === "showApprovalRatio") {
      this.setState({
        showApprovalRatio: false,
        showSettledVolume: true,
        showTotalVolume: false,
      });
    } else if (current === "showTotalVolume") {
      this.setState({
        showApprovalRatio: true,
        showSettledVolume: false,
        showTotalVolume: false,
      });
    } else if (current === "showSettledVolume") {
      this.setState({
        showApprovalRatio: false,
        showSettledVolume: false,
        showTotalVolume: true,
      });
    }
  };

  handleNextArrowclick = (current) => {
    if (current === "showApprovalRatio") {
      this.setState({
        showApprovalRatio: false,
        showSettledVolume: false,
        showTotalVolume: true,
      });
    } else if (current === "showTotalVolume") {
      this.setState({
        showApprovalRatio: false,
        showSettledVolume: true,
        showTotalVolume: false,
      });
    } else if (current === "showSettledVolume") {
      this.setState({
        showApprovalRatio: true,
        showSettledVolume: false,
        showTotalVolume: false,
      });
    }
  };

  handleButtonClick = (buttonName) => {
    if (buttonName === "overviewInfo") {
      this.setState({
        overviewInfo: true,
        ratesInfo: false,
        settlementInfo: false,
      });
    } else if (buttonName === "ratesInfo") {
      this.setState({
        overviewInfo: false,
        ratesInfo: true,
        settlementInfo: false,
      });
      this.fetchRatesData();
    } else if (buttonName === "settlementInfo") {
      this.setState({
        overviewInfo: false,
        ratesInfo: false,
        settlementInfo: true,
      });
    }
  };

  handleAddMerchant = () => {
    this.setState({
      isAddMerchantPanelOpen: !this.state.isAddMerchantPanelOpen,
    });
  };

  handleNext = () => {
    const { companyInfo, businessInfo } = this.state;
    if (companyInfo) {
      this.setState({ companyInfo: false, businessInfo: true });
    } else if (businessInfo) {
      this.setState({ businessInfo: false, directorInfo: true });
    }
  };

  handleBack = () => {
    const { businessInfo, directorInfo } = this.state;
    if (directorInfo) {
      this.setState({ directorInfo: false, businessInfo: true });
    } else if (businessInfo) {
      this.setState({ businessInfo: false, companyInfo: true });
    }
  };

  handleSuspendClick = () => {
    this.setState({ isSuspended: true });
  };

  handleAddMerchantClick = () => {
    this.setState({ isSuspended: false });
  };

  renderButtons = () => {
    const { overviewInfo, ratesInfo, settlementInfo } = this.state;
    return (
      <div className="btn-container">
        {overviewInfo ? (
          <button className="btn-primary btn3">
            <PendingUserIcon className=" white-icon" width="20" height="20" />
            <p>Overview</p>
          </button>
        ) : (
          <div
            onClick={() => this.handleButtonClick("overviewInfo")}
            className="btn-secondary btn-inactive"
          >
            {/* <img className="" src={overviewBlack} alt="overview"></img> */}
            <PendingUserIcon className=" black-icon" width="20" height="20" />
            <p className="p2">Overview</p>
          </div>
        )}
        {ratesInfo ? (
          <button className="btn-primary btn3">
            <MerchantRates className=" white-icon" />
            <p>Rates</p>
          </button>
        ) : (
          <div
            onClick={() => this.handleButtonClick("ratesInfo")}
            className="btn-secondary btn-inactive"
          >
            <MerchantRates className=" black-icon" />
            <p className="p2">Rates</p>
          </div>
        )}
        {settlementInfo ? (
          <button className="btn-primary btn3">
            <MerchantSettlements className=" white-icon" />
            <p>Settlements</p>
          </button>
        ) : (
          <div
            onClick={() => this.handleButtonClick("settlementInfo")}
            className="btn-secondary btn-inactive"
          >
            <MerchantSettlements className=" black-icon" />
            <p className="p2">Settlements</p>
          </div>
        )}
      </div>
    );
  };

  handleEditClick = () => {
    this.setState({ isEditing: !this.state.isEditing });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      ratesData: {
        ...prevState.ratesData,
        [name]: value,
      },
    }));
  };

  handleSave = () => {
    this.setState({ isEditing: false });
  };

  render() {
    const { isSuspended, overviewData, isEditing, ratesData } = this.state;

    return (
      <>
        <Header />
        <Sidebar />
        <div
          className={`main-screen ${
            this.state.sidebaropen
              ? "collapsed-main-screen"
              : "expanded-main-screen"
          }  `}
        >
          <div className="view-merchant-container">
            <div className="row-cards left-section">
              <div className="left-section-top">
                <div className="profile-image">
                  <img src={profile} alt="user profile"></img>
                </div>
                <h5>{this.state.company_name}</h5>
                <p>{this.getStatusText(overviewData.status)}</p>
                {this.state.showApprovalRatio && (
                  <div className="approve-volume-container">
                    <LeftSign
                      className="icon2"
                      onClick={() =>
                        this.handleBackArrowclick("showApprovalRatio")
                      }
                    ></LeftSign>

                    <div className="approval-div-section">
                      <div>
                        <div className="creditcard-div">
                          <ApprovalRatio className="creditcard-img primary-color-icon" />
                        </div>
                      </div>
                      <div>
                        <h5>99%</h5>
                        <p className="p2">Approval Ratio</p>
                      </div>
                    </div>
                    <RightSign
                      className="icon2"
                      onClick={() =>
                        this.handleNextArrowclick("showApprovalRatio")
                      }
                    />
                  </div>
                )}
                {this.state.showTotalVolume && (
                  <div className="approve-volume-container">
                    <LeftSign
                      className="icon2"
                      onClick={() =>
                        this.handleBackArrowclick("showTotalVolume")
                      }
                    />

                    <div className="approval-div-section">
                      <div>
                        <div className="creditcard-div">
                          <CreaditCard className="creditcard-img primary-color-icon" />
                        </div>
                      </div>
                      <div>
                        <h5>${this.formatValue(this.state.volumeData["totalVolume"])}</h5>
                        <p className="p2">Total Volume</p>
                      </div>
                    </div>
                    <RightSign
                      className="icon2"
                      onClick={() =>
                        this.handleNextArrowclick("showTotalVolume")
                      }
                    />
                  </div>
                )}
                {this.state.showSettledVolume && (
                  <div className="approve-volume-container">
                    <LeftSign
                      className="icon2"
                      onClick={() =>
                        this.handleBackArrowclick("showSettledVolume")
                      }
                    />

                    <div className="approval-div-section">
                      <div>
                        <div className="creditcard-div">
                          <DollarCircle className="creditcard-img primary-color-icon" />
                        </div>
                      </div>
                      <div>
                        <h5>${this.formatValue(this.state.volumeData["settledVolume"])}</h5>
                        <p className="p2">Settled Volume</p>
                      </div>
                    </div>
                    <RightSign
                      className="icon2"
                      onClick={() =>
                        this.handleNextArrowclick("showSettledVolume")
                      }
                    />
                  </div>
                )}
              </div>
              <div className="left-section-middle">
                <p>Details</p>
                <div className="create-settelments-horizontal-line"></div>
                <div className="left-section-middle-body">
                  <p>ABOUT</p>
                  <ul>
                    <li>
                      <div className="p2 icons-div">
                        <User className="merchant-icon" />
                        Username:&nbsp;
                        <p>{overviewData.username}</p>
                      </div>
                    </li>
                    <li>
                      <div className="p2 icons-div">
                        <Id className="merchant-icon"></Id>
                        Merchant ID:&nbsp;
                        <p>{overviewData.merchant_id}</p>
                      </div>
                    </li>
                    <li>
                      <div className="p2 icons-div">
                        <URL className="merchant-icon" />
                        Website URL:&nbsp;
                        <p>{overviewData.website_url}</p>
                      </div>
                    </li>
                    <li>
                      <div className="p2 icons-div">
                        <Industry className="merchant-icon" />
                        Industry:&nbsp;
                        <p>{overviewData.industry}</p>
                      </div>
                    </li>
                  </ul>

                  <p className="p2">CONTACTS</p>
                  <ul>
                    <li>
                      <div className="p2 icons-div">
                        <Phone className="merchant-icon" />
                        Phone No:&nbsp;
                        <p>{overviewData.phone_number}</p>
                      </div>
                    </li>
                    <li>
                      <div className="p2 icons-div">
                        <Email className="merchant-icon" />
                        Email:&nbsp;
                        <p>{overviewData.email}</p>
                      </div>
                    </li>
                    <li>
                      <div className="p2 icons-div">
                        <Skype className="merchant-icon" />
                        Skype:&nbsp;
                        <p>{overviewData.skype_id}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="left-section-bottom">
                <button
                  className="btn-primary"
                  onClick={() => this.handleAddMerchant()}
                  disabled={isSuspended}
                >
                  Edit
                </button>
                {isSuspended ? (
                  <button
                    className="btn-secondary btn-activate"
                    onClick={this.handleAddMerchantClick}
                  >
                    Activate
                  </button>
                ) : (
                  <button
                    className="btn-secondary btn-suspend"
                    onClick={this.handleSuspendClick}
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
            <div className="right-section">
              <div className="btn-container">{this.renderButtons()}</div>
              <div className="row-cards">
                {this.state.overviewInfo && (
                  <div className="right-section-middle-body">
                    <h5>Business Details</h5>
                    <div className="overview-head">
                      <Address className="merchant-icon" />
                      <p>ADDRESS</p>
                    </div>
                    <div className="overview-details">
                      <ul>
                        <li>
                          <div className="p2 icons-div">
                            Country:&nbsp;
                            <p>{overviewData.country}</p>
                          </div>
                        </li>
                        <li>
                          <div className="p2 icons-div">
                            City:&nbsp;
                            <p>{overviewData.city}</p>
                          </div>
                        </li>
                        <li>
                          <div className="p2 icons-div">
                            Street Address1:&nbsp;
                            <p>{overviewData.street_address}</p>
                          </div>
                        </li>
                      </ul>

                      <ul>
                        <li>
                          <div className="p2 icons-div">
                            State:&nbsp;
                            <p>{overviewData.state}</p>
                          </div>
                        </li>
                        <li>
                          <div className="p2 icons-div">
                            Postal Code:&nbsp;
                            <p>{overviewData.postal_code}</p>
                          </div>
                        </li>
                        <li>
                          <div className="p2 icons-div">
                            Street Address2:&nbsp;
                            <p>{overviewData.street_address2}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="create-settelments-horizontal-line"></div>
                    <div className="overview-head">
                      <BusinessInfo className="merchant-icon" />
                      <p>BUSINESS INFO</p>
                    </div>

                    <div className="overview-details">
                      <ul>
                        <li>
                          <div className="p2 icons-div">
                            Type:&nbsp;
                            <p>{overviewData.business_type}</p>
                          </div>
                        </li>
                        <li>
                          <div className="p2 icons-div">
                            Sub Category:&nbsp;
                            <p>{overviewData.business_subcategory}</p>
                          </div>
                        </li>
                        <li>
                          <div className="p2 icons-div">
                            Pay In:&nbsp;
                            <p>{overviewData.merchant_pay_in}</p>
                          </div>
                        </li>

                        <li>
                          <div className="p2 icons-div">
                            Settlement Charge:&nbsp;
                            <p>{overviewData.settlement_charge}</p>
                          </div>
                        </li>

                        <li>
                          <div className="p2 icons-div">
                            Expected Chargeback Percentage:&nbsp;
                            <p>{overviewData.expected_chargeback_percentage}</p>
                          </div>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <div className="p2 icons-div">
                            Category:&nbsp;
                            <p>{overviewData.business_category}</p>
                          </div>
                        </li>

                        <li>
                          <div className="p2 icons-div">
                            Registered On:&nbsp;
                            <p>{overviewData.buiness_registered_on}</p>
                          </div>
                        </li>

                        <li>
                          <div className="p2 icons-div">
                            Pay Out:&nbsp;
                            <p>{overviewData.merchant_pay_out}</p>
                          </div>
                        </li>

                        <li>
                          <div className="p2 icons-div">
                            Turnover:&nbsp;
                            <p>{overviewData.turnover}</p>
                          </div>
                        </li>
                        <li>
                          <div className="p2 icons-div">
                            Industries ID:&nbsp;
                            <p>{overviewData.industries_id}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="create-settelments-horizontal-line"></div>
                    <div className="overview-head">
                      <DirectorInfo className="merchant-icon" />
                      <p>DIRECTOR INFO</p>
                    </div>

                    <div className="overview-details">
                      <ul>
                        <li>
                          <div className="p2 icons-div">
                            First Name:&nbsp;
                            <p>{overviewData.director_first_name}</p>
                          </div>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <div className="p2 icons-div">
                            Last Name:&nbsp;
                            <p>{overviewData.director_last_name}</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                {/* Rates section */}
                {this.state.ratesInfo && (
                  <div className="right-section-middle-body">
                    <h5>Current Prices</h5>
                    <div className="rates-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Charging Items</th>
                            <th>Charging Rates or Amount</th>
                            <th>Remark</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="MDRName"
                                  value={this.MDRName}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`MDR`}
                                />
                              ) : (
                                `MDR`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="MDR"
                                  value={ratesData.MDR}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.MDR} %`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="TranAp"
                                  value={this.TranAp}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Transaction Approved`}
                                />
                              ) : (
                                `Transaction Approved`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="txn_app"
                                  value={ratesData.txn_app}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.txn_app} ${ratesData.currency}`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="TranDec"
                                  value={this.TranDec}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Transaction Declined`}
                                />
                              ) : (
                                `Transaction Declined`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="txn_dec"
                                  value={ratesData.txn_dec}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.txn_dec} ${ratesData.currency}`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="Reffee"
                                  value={this.RefFee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Refund Fees`}
                                />
                              ) : (
                                `Refund Fees`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="refund_fee"
                                  value={ratesData.refund_fee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.refund_fee} ${ratesData.currency}`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="ChrgFee"
                                  value={this.ChrgFee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Chargeback Fees`}
                                />
                              ) : (
                                `Chargeback Fees`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="chargeback_fee"
                                  value={ratesData.chargeback_fee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.chargeback_fee} ${ratesData.currency}`
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="RollFee"
                                  value={this.RollFee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Rolling Reserve`}
                                />
                              ) : (
                                `Rolling Reserve`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="RR"
                                  value={ratesData.RR}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.RR} %`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="fordays"
                                  value={this.fordays}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`for 180 Days`}
                                />
                              ) : (
                                `for 180 Days`
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="setsFee"
                                  value={this.setsFee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Setup Fees`}
                                />
                              ) : (
                                `Setup Fees`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="setup_fee"
                                  value={ratesData.setup_fee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.setup_fee} ${ratesData.currency}`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="chrgfirstset"
                                  value={this.chrgfirstset}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Charged from first settlement`}
                                />
                              ) : (
                                `Charged from first settlement`
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="setCycl"
                                  value={this.setCycl}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Settlement Cycle`}
                                />
                              ) : (
                                `Settlement Cycle`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="settlement_cycle"
                                  value={ratesData.settlement_cycle}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                ratesData.settlement_cycle
                              )}
                            </td>
                            <td>-</td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="setFee"
                                  value={this.setFee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Settlement Fees`}
                                />
                              ) : (
                                `Settlement Fees`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="settlement_fee"
                                  value={ratesData.settlement_fee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.settlement_fee} %`
                              )}
                            </td>

                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="usdtSet"
                                  value={this.usdtSet}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`USDT settlement`}
                                />
                              ) : (
                                `USDT settlement`
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="anulmainfee"
                                  value={this.anulmainfee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Annual Maintenance Fees`}
                                />
                              ) : (
                                `Annual Maintenance Fees`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="annual_maintenance_fee"
                                  value={ratesData.annual_maintenance_fee}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                />
                              ) : (
                                `${ratesData.annual_maintenance_fee} ${ratesData.currency}`
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input
                                  type="text"
                                  name="chrgfirstset"
                                  value={this.chrgfirstset}
                                  onChange={this.handleChange}
                                  className="editable-input"
                                  defaultValue={`Charged from first settlement and payable annually`}
                                />
                              ) : (
                                `Charged from first settlement and payable annually`
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="rates-table-button-container">
                      <button
                        className="btn-primary"
                        onClick={
                          isEditing ? this.handleSave : this.handleEditClick
                        }
                      >
                        {isEditing ? "Update" : "Edit"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Settlement section */}
                {this.state.settlementInfo && (
                  <div className="right-section-middle-body">
                    <div className="settlements-container">
                      <img
                        src={settlemntimg}
                        alt=""
                        className="settelmentimg"
                      />
                    </div>
                  </div>
                )}
                {this.state.isAddMerchantPanelOpen && (
                  <>
                    {" "}
                    <div className="overlay"></div>
                    <div className="sendPanel">
                      <div className="sendPanel-header">
                        {" "}
                        <h5>Add New Merchant</h5>
                        <Close
                          className="icon"
                          onClick={() => this.handleAddMerchant()}
                        ></Close>
                      </div>
                      <div className="sendPanel-body add-merchant-body">
                        {/* Company Info */}
                        {this.state.companyInfo && (
                          <div className="add-merchant-form">
                            <p className="p2">Company Info</p>
                            <form onSubmit={this.handleSubmit}>
                              <div className="add-merchant-form-top">
                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="company_name"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.company_name}
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
                                    id="username"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.username}
                                    onChange={this.handleInputChange}
                                  />
                                  <label
                                    htmlFor="userName"
                                    className="inputLabel"
                                  >
                                    Username
                                  </label>
                                </div>

                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="email"
                                    id="email"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.email}
                                    onChange={this.handleInputChange}
                                  />
                                  <label
                                    htmlFor="password"
                                    className="inputLabel"
                                  >
                                    Email
                                  </label>
                                </div>
                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="phone_number"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.phone_number}
                                    onChange={this.handleInputChange}
                                  />
                                  <label
                                    htmlFor="phoneNo"
                                    className="inputLabel"
                                  >
                                    Phone Number
                                  </label>
                                </div>

                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="postal_code"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.postal_code}
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
                                    required
                                    value={overviewData.country}
                                    onChange={this.handleInputChange}
                                  />
                                  <label
                                    htmlFor="country"
                                    className="inputLabel"
                                  >
                                    Country/Region
                                  </label>
                                </div>

                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="state"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.state}
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
                                    required
                                    value={overviewData.city}
                                    onChange={this.handleInputChange}
                                  />
                                  <label htmlFor="city" className="inputLabel">
                                    City
                                  </label>
                                </div>

                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="street_address"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.street_address}
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
                                    id="street_address2"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.street_address2}
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
                                    id="industries_id"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.industries_id}
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
                                  type="submit"
                                  className="add-merchant-panel-btn"
                                  onClick={this.handleNext}
                                >
                                  <RightArrow />
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Business Info */}
                        {this.state.businessInfo && (
                          <div className="add-merchant-form">
                            <p className="p2">Business Info</p>
                            <form onSubmit={this.handleSubmit}>
                              <div className="add-merchant-form-top">
                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="business_type"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.business_type}
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
                                    id="business_category"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.business_category}
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
                                    id="business_subcategory"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.business_subcategory}
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
                                    id="business_registered_on"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.business_registered_on}
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
                                    id="merchant_pay_in"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.merchant_pay_in}
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
                                    id="merchant_pay_out"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.merchant_pay_out}
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
                                    required
                                    value={overviewData.turnover}
                                    onChange={this.handleInputChange}
                                  />
                                  <label
                                    htmlFor="turnover"
                                    className="inputLabel"
                                  >
                                    Turnover
                                  </label>
                                </div>
                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="website_url"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.website_url}
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
                                    id="settlement_charge"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.settlement_charge}
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
                                    id="expected_chargeback_percentage"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={
                                      overviewData.expected_chargeback_percentage
                                    }
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
                                  onClick={this.handleBack}
                                >
                                  <LeftArrow />
                                </button>
                                <button
                                  type="submit"
                                  className="add-merchant-panel-btn"
                                  onClick={this.handleNext}
                                >
                                  <RightArrow />
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
                                    id="director_first_name"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.director_first_name}
                                    onChange={this.handleInputChange}
                                  />
                                  <label
                                    htmlFor="firstName"
                                    className="inputLabel"
                                  >
                                    First Name
                                  </label>
                                </div>
                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="director_last_name"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.director_last_name}
                                    onChange={this.handleInputChange}
                                  />
                                  <label
                                    htmlFor="lastName"
                                    className="inputLabel"
                                  >
                                    Last Name
                                  </label>
                                </div>
                                <div className="input-group add-merchant-input-group">
                                  <input
                                    type="text"
                                    id="skype_id"
                                    className="inputFeild add-merchant-input"
                                    required
                                    value={overviewData.skype_id}
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
                                  onClick={this.handleBack}
                                >
                                  <LeftArrow />
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
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="icons-div">
                    <img
                      src={calender}
                      alt="calender"
                      onClick={() => this.handleCalenderClick()}
                    ></img>
                  </div>
                  {this.state.calendarVisible && (
                    <div className="dates-container">
                      <div className="dates-div">
                        <label className="p2" htmlFor="fromDate">
                          From:{" "}
                        </label>
                        <p className="p2">{this.state.fromDate}</p>
                        <input
                          type="datetime-local"
                          id="fromDate"
                          className="inputFeild date-input"
                          required
                          onChange={this.handleInputChange}
                          value={this.state.fromDate}
                        />
                      </div>
                      <div className="dates-div">
                        <label className="p2" htmlFor="toDate">
                          To:{" "}
                        </label>
                        <p className="p2">{this.state.toDate}</p>
                        <input
                          type="datetime-local"
                          id="toDate"
                          className="inputFeild date-input"
                          required
                          onChange={this.handleInputChange}
                          value={this.state.toDate}
                        />
                      </div>
                    </div>
                  )} */}
      </>
    );
  }
}

export default ViewMerchant;
