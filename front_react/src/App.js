import React from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      error: "",
      isLoggedIn: false,
      logo: logo,
      title: "Company Title",
      token: null,
      client: "demo",
      email: "deena@dualparadox.com",
      password: "test",
      query: "",
      member_list: [],
      member: null
    };
  }

  handleMemberChange = event => {
    this.setState({ member: this.state.member_list[event.target.value] });
    console.log(this.state.member);
    console.log(this.state.member_list[event.target.value]);
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleStep1 = event => {
    event.preventDefault();
    let currentStep = this.state.currentStep;
    const client = this.state.client;
    const email = this.state.email;
    const password = this.state.password;

    fetch(`http://localhost:4200/api/login/${client}/${email}/${password}`)
      .then(res => res.json())
      .then(
        result => {
          if (result.success == true) {
            this.setState({
              isLoggedIn: true,
              token: result.token,
              logo: result.company_logo,
              title: result.company_name
            });
            currentStep = 2;
            this.setState({
              currentStep: currentStep
            });
          } else {
            this.setState({
              error: "Login data is wrong."
            });
          }
        },
        error => {
          this.setState({
            isLoggedIn: false,
            error: "Login data is wrong."
          });
        }
      );
  };

  handleStep2 = event => {
    event.preventDefault();
    let currentStep = this.state.currentStep;
    if (this.state.member) {
      currentStep = 3;
      this.setState({
        currentStep: currentStep
      });
    }
  };

  handleStep4 = event => {
    event.preventDefault();
    let currentStep = this.state.currentStep;
    if (this.state.member) {
      currentStep = 1;
      this.setState({
        currentStep: currentStep
      });
    }
  };

  handleMembersInput = event => {
    let input = event.target.value;
    let currentStep = this.state.currentStep;
    fetch(
      `http://localhost:4200/api/get_members/${this.state.client}/${this.state.token}/${input}`
    )
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          if (result) {
            this.setState({
              member_list: result
            });
          }
        },
        error => {
          this.setState({
            member_list: [],
            error: "Something wrong."
          });
        }
      );
  };

  handleSendEmail = message_text => {
    fetch(`http://localhost:4200/api/send_email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        member_name: this.state.member.name,
        member_email: this.state.member.email,
        message_text: message_text
      })
    })
      .then(res => res.json())
      .then(
        result => {},
        error => {
          this.setState({
            error: "Something wrong."
          });
        }
      );
    let currentStep = this.state.currentStep;
    currentStep = 4;
    this.setState({
      currentStep: currentStep
    });
    setTimeout(
      function() {
        let currentStep = this.state.currentStep;
        currentStep = 1;
        this.setState({
          currentStep: currentStep
        });
      }.bind(this),
      10000
    );
  };

  handleMeetYouButton = event => {
    this.handleSendEmail("meet you");
  };

  handleDeliveryButton = event => {
    this.handleSendEmail("drop off a delivery");
  };

  handleSayHiButton = event => {
    this.handleSendEmail("say hi");
  };

  render() {
    return (
      <React.Fragment>
        <div className="App">
          <nav class="navbar navbar-light bg-light">
            <a class="navbar-brand" href="#">
              <img src={this.state.logo} width="100" height="100" alt="" />
              {this.state.title}
            </a>
          </nav>
        </div>
        <div className="row">
          <div className="col">
            <br></br>
            <p>Step {this.state.currentStep} </p>
            <Step1
              currentStep={this.state.currentStep}
              error={this.state.error}
              handleStep1={this.handleStep1}
              handleChange={this.handleChange}
              client={this.state.client}
              email={this.state.email}
            />
            <Step2
              currentStep={this.state.currentStep}
              handleStep2={this.handleStep2}
              handleMembersInput={this.handleMembersInput}
              member_list={this.state.member_list}
              handleChange={this.handleChange}
              handleMemberChange={this.handleMemberChange}
            />
            <Step3
              currentStep={this.state.currentStep}
              handleDeliveryButton={this.handleDeliveryButton}
              handleSayHiButton={this.handleSayHiButton}
              handleMeetYouButton={this.handleMeetYouButton}
            />
            <Step4
              currentStep={this.state.currentStep}
              member={this.state.member}
              handleStep4={this.handleStep4}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function Step1(props) {
  if (props.currentStep !== 1) {
    return null;
  }
  return (
    <div className="row">
      <div className="col">
        <h2>Hello!</h2>
        <h3>Here to meet someone?</h3>
      </div>
      <div className="col">
        <p className="text-danger">{props.error}</p>
        <div className="form-group">
          <label htmlFor="client">Client Name</label>
          <input
            required
            className="form-control"
            id="client"
            name="client"
            type="text"
            placeholder="Enter client name"
            value={props.client}
            onChange={props.handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            required
            className="form-control"
            id="email"
            name="email"
            type="text"
            placeholder="Enter email"
            value={props.email}
            onChange={props.handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            required
            className="form-control"
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={props.password}
            onChange={props.handleChange}
          />
        </div>
        <button
          className="btn btn-primary float-right"
          type="button"
          onClick={props.handleStep1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Step2(props) {
  if (props.currentStep !== 2) {
    return null;
  }
  return (
    <div className="row">
      <div className="col">
        <h3>Who are you visiting?</h3>
      </div>
      <div className="col">
        <div className="form-group">
          <label htmlFor="query">Members</label>
          <input
            className="form-control"
            id="query"
            name="query"
            type="text"
            placeholder="Enter member name"
            onInput={props.handleMembersInput}
          />
        </div>
        <div class="form-group">
          <select class="form-control" onChange={props.handleMemberChange}>
            <option value="">Select</option>
            {props.member_list.map((member, key) => (
              <option key={key} value={key}>
                {member.name} - {member.email}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary float-right"
          type="button"
          onClick={props.handleStep2}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Step3(props) {
  if (props.currentStep !== 3) {
    return null;
  }
  return (
    <React.Fragment>
      <div className="row">
        <div className="col">
          <h3>What would you like to say?</h3>
        </div>
        <div className="col">
          <button
            className="btn btn-primary btn-lg btn-block"
            type="button"
            onClick={props.handleDeliveryButton}
          >
            Delivery
          </button>
          <button
            className="btn btn-primary btn-lg btn-block"
            type="button"
            onClick={props.handleMeetYouButton}
          >
            I am Here
          </button>
          <button
            className="btn btn-primary btn-lg btn-block"
            type="button"
            onClick={props.handleSayHiButton}
          >
            Just wanted to say Hi
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

function Step4(props) {
  if (props.currentStep !== 4) {
    return null;
  }
  return (
    <React.Fragment>
      <div className="row">
        <div className="col">
          <h3>Hi {props.member.name}!</h3>
          <h2>You are all set</h2>
        </div>
        <div className="col">
          <button
            className="btn btn-primary btn-lg btn-block"
            type="button"
            onClick={props.handleStep4}
          >
            Done
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
