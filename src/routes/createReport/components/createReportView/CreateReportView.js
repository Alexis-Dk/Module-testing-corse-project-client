import React, {Component} from 'react'
import {connect} from 'react-redux'
import './CreateReportView.scss'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import { withStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import {GET_MINE_TASK} from "../../../../api/task/taskActions";
import Button from "@material-ui/core/Button";
import {DateTimePicker} from 'material-ui-pickers';
import {
  DATE_TIME_FORMAT_DEFAULT,
  DATE_TIME_MASK,
  UTC_FORMAT,
  VIEW_TASKS_PAGE_PATH
} from "../../../../properties/properties";
import moment from "moment";
import {SAVE_REPORT} from "../../../../api/report/reportActions";
import {REPORT_WAS_SUCCESSFULLY_ADDED} from "../../../../api/flash/flashActions";
import {browserHistory} from "react-router";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: 20,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    margin: '10px',
  },
});

class CreateReportView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      auth: null,
      tasks: [],
      currentTask: null,

      distance: null,
      departure: null,
      arrival: null,
    }
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentDidMount() {
    this.props.getMineTasks({
      data: {},
      credentials: {emailAddress: this.props.auth.user.emailAddress, password: this.props.auth.user.password}
    });
    this.props.task && this.props.task.map(task => {if (task.taskStatus === 'IN_PROGRESS') {this.setState({currentTask: task.id})}});
    if (this.props.task && this.props.task !== this.props.task) {
      this.setState({tasks: this.props.task});
      this.props.task.map(task => {if (task.taskStatus === 'IN_PROGRESS') {this.setState({currentTask: task.id})}});
    }
  }

  componentWillReceiveProps(nextprops) {
    if (nextprops.task && nextprops.task !== this.props.task) {
      this.setState({tasks: nextprops.task});
      nextprops.task.map(task => {if (task.taskStatus === 'IN_PROGRESS') {this.setState({currentTask: task.id})}});
    }
    if (nextprops.auth !== this.props.auth) {
      if (nextprops.auth && !nextprops.auth.isAuthenticated) {
        this.setState({currentTask: null});
      }
    }
    if (nextprops.flashMessages !== this.props.flashMessages) {
      nextprops.flashMessages.map((msg) => {if (msg.text === REPORT_WAS_SUCCESSFULLY_ADDED) {
        browserHistory.push(VIEW_TASKS_PAGE_PATH)}});
    }
  }

  onChangeDistance  = (e) => {
    this.setState({distance: e.target.value});
  };

  onChangeDeparture  = (e) => {
    let departure = new Date(e);
    let departureToUTC = moment(departure).format(UTC_FORMAT);
    this.setState({departure: departureToUTC});
  };

  onChangeArrival = (e) => {
    let arrival = new Date(e);
    let arrivalToUTC = moment(arrival).format(UTC_FORMAT);
    this.setState({arrival: arrivalToUTC});
  };

  saveReport = () => {
    this.props.saveReport({
      data: {
        taskId: this.state.currentTask,
        report: {
          departure: this.state.departure,
          distance: this.state.distance,
          arrival: this.state.arrival,
        }
      },
      credentials: {emailAddress: this.props.auth.user.emailAddress, password: this.props.auth.user.password}
    });
  };

  render = () => {
    const {classes, auth} = this.props;


    return (
      <div style={{height: '650px', marginLeft: '200px'}}>
        <MuiThemeProvider>
          {auth.isAuthenticated && this.state.currentTask ?
              (
                  <div style={{width: '700px'}}>
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <div style={{textAlign: 'center'}}> <h4>Create daily report for current active task №{this.state.currentTask}</h4></div>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <div className={classes.paper}>Distance</div>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <div className={classes.paper} style={{borderColor: '#43434'}}>
                          <TextField
                              type="number"
                              underlineStyle={{borderColor: '#1eb1da', color: '#1eb1da'}}
                              style={{width: '200px', marginTop: '-10px', marginLeft: '-300px'}}
                              onChange={this.onChangeDistance}
                              name='weight'
                              //value={this.state.username}
                          />
                        </div>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <div className={classes.paper}>Departure</div>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <React.Fragment className={classes.paper} style={{borderColor: '#43434'}}>
                          <DateTimePicker
                              name="departure"
                              showTabs={true}
                              autoSubmit={false}
                              ampm={false}
                              keyboard
                              format={DATE_TIME_FORMAT_DEFAULT}
                              mask={DATE_TIME_MASK}
                              value={this.state.departure}
                              style={{
                                width: '200px',
                                margin: '16px 8px 0px 8px',
                              }}
                              showTodayButton
                              okLabel="Ok"
                              cancelLabel="Cancel"
                              todayLabel="Today"
                              onChange={this.onChangeDeparture}
                          />
                        </React.Fragment>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <div className={classes.paper}>Arrival</div>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <React.Fragment className={classes.paper} style={{borderColor: '#43434'}}>
                          <DateTimePicker
                              name="arrival"
                              showTabs={true}
                              autoSubmit={false}
                              ampm={false}
                              keyboard
                              format={DATE_TIME_FORMAT_DEFAULT}
                              mask={DATE_TIME_MASK}
                              value={this.state.arrival}
                              style={{
                                width: '200px',
                                margin: '16px 8px 0px 8px',
                              }}
                              showTodayButton
                              okLabel="Ok"
                              cancelLabel="Cancel"
                              todayLabel="Today"
                              onChange={this.onChangeArrival}
                          />
                        </React.Fragment>
                      </Grid>
                    </Grid>
                    <div style={{marginLeft: '175px', marginTop: '30px'}}>
                      {this.state.distance && this.state.departure && this.state.arrival &&
                      <Button variant="contained" color="primary" onClick={this.saveReport}>
                        Add
                      </Button>
                      }
                    </div>

                  </div>
              )
                  :
              (
                  <div></div>
              )
          }

        </MuiThemeProvider>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    auth: state.auth || {},
    task: state.task.list || [],
    flashMessages: state.flashMessages,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getMineTasks: (data) => dispatch({type: GET_MINE_TASK, data}),
    saveReport: (data) => dispatch({type: SAVE_REPORT, data}),
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreateReportView));
