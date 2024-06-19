import React, { Component } from "react";
import { Link } from "react-router-dom";

// components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import SettlementTable from "../components/Settlement_Table";
import MessageBox from "../components/Message_box";

// images
import { Article, DollarCircle, User, Wallet, LeftArrow } from "../../media/icon/SVGicons";

class PreviewSettlement extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sidebaropen: true,
			token: localStorage.getItem("token"),
			company_name: this.extractENameFromURL(),
			headerLabels: [
				{ id: 1, heading: "# Report", label: "report_id" },
				{ id: 2, heading: "Status", label: "status" },
				{ id: 3, heading: "Total Volume ($)", label: "total_vol" },
				{ id: 4, heading: "Settlement Volume ($)", label: "settlement_vol" },
				{ id: 5, heading: "Issued On", label: "date_settled" },
			],
			apiData: [],
			volumeData: [],
			showReport: true,
			errorMessage: "",
			messageType:"",
		};
	}

	componentDidMount() {
		this.showSettlementRecord(this.state.company_name);
		this.fetchData(this.state.company_name);
	}

	extractENameFromURL() {
		const currentPath = window.location.pathname;
		const afterpreviewsettlement = currentPath.split("/previewsettlement/")[1];
		return afterpreviewsettlement;
	}

	showSettlementRecord = async (company_name) => {
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		const { token } = this.state;
		try {
			const response = await fetch(`${backendURL}/settlements?company_name=${company_name}`, {
				method: "GET",
				headers: {
				  "Content-Type": "application/json",
				  Authorization: `Bearer ${token}`,
				},
			  });
			const result = await response.json();
			this.setState({ apiData: result });
		} catch (error) {
			this.setState({ errorMessage: "Error fetching settlement details:", messageType: "fail"});
		}
	};

	fetchData = async (company_name) => {
		const backendURL = process.env.REACT_APP_BACKEND_URL;
		const { token } = this.state;
		try {
			const response = await fetch(`${backendURL}/volumesum?company_name=${company_name}`, {
				method: "GET",
				headers: {
				  "Content-Type": "application/json",
				  Authorization: `Bearer ${token}`,
				},
			  });
			const result = await response.json();
			this.setState({ volumeData: result });
		} catch (error) {
			this.setState({ errorMessage: "Error fetching settlement details:", messageType: "fail"});
		}
	};

	formatValue = (val) => {
		return `${(val / 1000).toFixed(1)}k`;
	};

	render() {
		const { headerLabels, apiData, showReport, errorMessage,messageType } = this.state;

		const length = apiData.length;

		return (
			<>
				{errorMessage && <MessageBox message={errorMessage} messageType={messageType} onClose={() => this.setState({ errorMessage: ""})} />}
				<Header />
				<Sidebar />
				<div
					className={`main-screen ${this.state.sidebaropen
							? "collapsed-main-screen"
							: "expanded-main-screen"
						}  `}
				>
					<div className="main-screen-rows settlement-first-row">
					<Link to="/settlements"> 
                <LeftArrow className=" back-button icon2" />
             </Link>
						<div className="row-cards settlement-card">
						
            
            
							<div className="settlement-card-section">
								<div>
								<h4>{this.state.company_name.split(/[^a-zA-Z\s]+/).join(' ')}</h4>
								</div>
								<div>
									<div className="creditcard-div">
										<User
											className="creditcard-img black-icon" width="28" height="28"
										></User>
									</div>
								</div>
							</div>
							<div className="vertical-line-card1"></div>
							<div className="settlement-card-section">
								<div>
									<h4>{length}</h4>
									<p className="p2">Invoices</p>
								</div>
								<div>
									<div className="creditcard-div">
										<Article
											className="creditcard-img black-icon"
										/>
									</div>
								</div>
							</div>
							<div className="vertical-line-card1"></div>
							<div className="settlement-card-section">
								<div>
									<h4>${this.formatValue(this.state.volumeData["totalVolume"])}</h4>
									<p className="p2">Total Volume</p>
								</div>
								<div>
									<div className="creditcard-div">
										<Wallet
											className="creditcard-img black-icon"
										/>
									</div>
								</div>
							</div>
							<div className="vertical-line-card1"></div>
							<div className="settlement-card-section">
								<div>
									<h4>${this.formatValue(this.state.volumeData["settledVolume"])}</h4>
									<p className="p2">Settled Volume</p>
								</div>
								<div>
									<div className="creditcard-div">
										<DollarCircle
											className="creditcard-img black-icon"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="main-screen-rows">
						<div className="row-cards table-card">
							<SettlementTable
								showBackButton={true}
								headerLabels={headerLabels}
								apiData={apiData}
								showReport={showReport}
								company_name={this.state.company_name}
								showSettlementRecord={this.showSettlementRecord}
							/>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default PreviewSettlement;