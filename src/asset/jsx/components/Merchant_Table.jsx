import React, { Component } from "react";
import { Link } from "react-router-dom";

// component
import MessageBox from "./Message_box";
import MerchantForm from "./Merchant_Form";

//SVG icons
import { RightSign, LeftSign } from "../../media/icon/SVGicons";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      highlightedOptions: [],
      noResultsFound: false,
      errorMessage: "",
      messageType: "",
      token: localStorage.getItem("token"),
      isAddMerchantPanelOpen: false,
      merchantData: {
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
        skype: ""
      },
    };
  }

  getStatusText(status) {
    switch (status) {
      case "Active":
        return (
          <div className="status-div success-status">
            <p>Active</p>
          </div>
        );
      case "Inactive":
        return (
          <div className="status-div failed-status">
            <p>Inactive</p>
          </div>
        );
      case "Pending":
        return (
          <div className="status-div pending-status">
            <p>Pending</p>
          </div>
        );
      default:
        return "";
    }
  }

  handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    const { apiData, headerLabels } = this.props;

    const filteredOptions = apiData.filter((row) =>
      headerLabels.some((label) =>
        String(row[label.label]).toLowerCase().includes(searchText)
      )
    );

    this.setState({
      searchText,
      highlightedOptions: filteredOptions,
      noResultsFound: filteredOptions.length === 0
    });
  };

  handleAddMerchant = (val) => {
    this.setState({
      isAddMerchantPanelOpen: val,
    });
  };

  render() {
    const { headerLabels, showMerchants } = this.props;
    const {
      highlightedOptions,
      errorMessage,
      searchText,
      noResultsFound,
    } = this.state;
    const dataToRender =
      highlightedOptions.length > 0 ? highlightedOptions : this.props.apiData;
    return (
      <>
        {errorMessage && (
          <MessageBox
            message={errorMessage}
            onClose={() => this.setState({ errorMessage: "" })}
          />
        )}
        <div className="Table-container">
          <div className="table-Header">
            <input
              className="inputFeild search-input"
              type="text"
              placeholder="Search"
              onChange={this.handleSearch}
              value={searchText}
            ></input>
            {showMerchants && (
              <button
                className="btn-primary"
                onClick={() => this.handleAddMerchant(true)}
              >
                Add New Merchant
              </button>
            )}
            {this.state.isAddMerchantPanelOpen &&
              <MerchantForm handleAddMerchant={this.handleAddMerchant} merchantData={this.state.merchantData} isAddMerchantPanelOpen={this.state.isAddMerchantPanelOpen} />
            }
          </div>
          <div className="table-Body">
            <table>
              <thead>
                <tr>
                  <th className="p1">S.No.</th>
                  {headerLabels.map((item) => (
                    <th className="p1">{item.heading}</th>
                  ))}
                  <th></th>
                </tr>
              </thead>
              <tbody>
              {noResultsFound ? (
              <tr>
                <td colSpan={headerLabels.length + (showMerchants ? 2 : 1)}>No results found.</td>
              </tr>
            ) : (dataToRender.map((row, index) => (
                  <tr className="p2" key={index}>
                    <td>{index + 1}</td>
                    {headerLabels.map((collabel, labelIndex) => (
                      <td key={labelIndex}>
                        {collabel.id === 2 && showMerchants
                          ? this.getStatusText(row[collabel.label])
                          : row[collabel.label]}
                      </td>
                    ))}

                    {showMerchants && (
                      <td>
                        <Link to={`/viewmerchant/${row.company_name}`}>
                          <RightSign
                            className="icon2"
                            title="View More"
                          ></RightSign>
                        </Link>
                      </td>
                    )}
                  </tr>
                 ))
                )}
              </tbody>
            </table>
          </div>
          <div className="table-Footer">
            <div className="table-footer-rows-div">
              <label htmlFor="noRows">Rows per page</label>
              <select id="noRows" value={this.state.rows} onChange={this.handleRowschange}>
                <option value={10} selected>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="table-footer-buttons-div">
              <p>
                {"1"}-{"10"} of {"400"}
              </p>
              <button><LeftSign /></button>
              <button><RightSign /></button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Table;