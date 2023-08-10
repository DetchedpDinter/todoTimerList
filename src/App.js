import React from 'react';
import { v4 as uuid } from 'uuid';
import {
    Container,
    Button,
    Card,
    Form,
    Grid,
    Segment,
    Message,
} from 'semantic-ui-react';
import './App.css';

class EditableForm extends React.Component {
    state = {
        isOpen: false,
    };
    taskSubmitted = (e) => {
        this.props.addTask(e);
    };
    isOpened = () => {
        this.setState({ isOpen: true });
    };
    isClosed = () => {
        this.setState({ isOpen: false });
    };
    render() {
        if (this.state.isOpen) {
            return (
                <FormEnter
                    isClosed={this.isClosed}
                    taskSubmitted={this.taskSubmitted}
                />
            );
        } else {
            return <PlusIcon isOpened={this.isOpened} />;
        }
    }
}

class FormEnter extends React.Component {
    state = {
        temp: '',
        flag: false,
    };
    handleChange = (e) => {
        if (!this.state.temp === '') {
            return this.setState({ flag: true });
        }
        this.setState({ temp: e.target.value, flag: false });
    };
    handleSubmit = () => {
        if (this.state.temp === '') {
            this.setState({ flag: true });
            return null;
        } else {
            this.props.taskSubmitted(this.state.temp);
            this.setState({
                temp: '',
            });
        }
    };
    render() {
        return (
            <Card centered>
                <Card.Header>
                    <Message hidden={this.state.flag ? false : true}>
                        Enter Name
                    </Message>
                </Card.Header>
                <Card.Content>
                    <Form>
                        <Form.Input
                            label="Enter Task"
                            type="text"
                            name="task_name"
                            onChange={this.handleChange}
                            value={this.state.temp}
                        />
                        <div className="ui two bottom attached buttons">
                            <Button
                                color="blue"
                                onClick={this.handleSubmit}
                            >
                                Enter
                            </Button>
                            <Button
                                color="red"
                                onClick={this.props.isClosed}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </Card.Content>
            </Card>
        );
    }
}

class DisplayList extends React.Component {
    render() {
        return (
            <Grid>
                <Grid columns={3}>
                    <Grid.Column>
                        {this.props.taskList.map((i) => {
                            if (!i.isFinished) {
                                return (
                                    <Segment
                                        style={{
                                            padding: '1em',
                                            margin: '1em',
                                        }}
                                        size="small"
                                    >
                                        <Segment.Group>
                                            <Segment.Group horizontal>
                                                <Segment
                                                    compact
                                                    attached
                                                    textAlign="center"
                                                    size="big"
                                                >
                                                    {i.taskName}
                                                </Segment>
                                                {i.isRunning ? (
                                                    <Segment
                                                        size="small"
                                                        onClick={() =>
                                                            this.props.finishTask(
                                                                i.id,
                                                            )
                                                        }
                                                    >
                                                        <i className="check icon" />
                                                    </Segment>
                                                ) : null}
                                                <Segment
                                                    size="small"
                                                    onClick={() =>
                                                        this.props.deleteTask(
                                                            i.id,
                                                        )
                                                    }
                                                >
                                                    <i className="trash icon" />
                                                </Segment>
                                            </Segment.Group>
                                            <Timer
                                                id={i.id}
                                                addTime={
                                                    this.props.addTime
                                                }
                                                time={i.totalTime}
                                                isFinished={
                                                    i.finishTask
                                                }
                                                stopTime={
                                                    this.props
                                                        .stopTime
                                                }
                                            />
                                        </Segment.Group>
                                    </Segment>
                                );
                            }
                        })}
                    </Grid.Column>
                    <Grid.Column textAlign="center">
                        <EditableForm
                            checkFlag={this.checkFlag}
                            addTask={this.props.addTask}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        {this.props.taskList.map((i) => {
                            if (i.isFinished) {
                                return (
                                    <Segment>
                                        <Segment.Group>
                                            <Segment.Group horizontal>
                                                <Segment
                                                    compact
                                                    attached
                                                    textAlign="center"
                                                    size="big"
                                                >
                                                    {i.taskName}
                                                </Segment>
                                                <Segment
                                                    size="small"
                                                    onClick={() =>
                                                        this.props.deleteTask(
                                                            i.id,
                                                        )
                                                    }
                                                >
                                                    <i className="trash icon" />
                                                </Segment>
                                            </Segment.Group>
                                            <Timer
                                                id={i.id}
                                                addTime={
                                                    this.props.addTime
                                                }
                                                time={i.totalTime}
                                                isFinished={
                                                    i.isFinished
                                                }
                                                stopTime={
                                                    this.props
                                                        .stopTime
                                                }
                                            />
                                        </Segment.Group>
                                    </Segment>
                                );
                            }
                        })}
                    </Grid.Column>
                </Grid>
            </Grid>
        );
    }
}

class PlusIcon extends React.Component {
    render() {
        return (
            <Button
                color="white"
                icon
                centered
                onClick={this.props.isOpened}
            >
                <i className="plus icon"></i>
            </Button>
        );
    }
}

class AddTask extends React.Component {
    state = {
        taskList: [
            {
                id: uuid(),
                taskName: 'sandip',
                isFinished: false,
                totalTime: { h: 0, m: 0, s: 0 },
                isRunning: false,
            },
        ],
    };
    addTime = (e, id) => {
        this.setState({
            taskList: this.state.taskList.map((task) => {
                if (task.id === id) {
                    return Object.assign({}, task, {
                        totalTime: e,
                        isRunning: true,
                    });
                } else {
                    return task;
                }
            }),
        });
    };
    stopTime = (id) => {
        this.setState({
            taskList: this.state.taskList.map((task) => {
                if (task.id === id) {
                    return Object.assign({}, task, {
                        isRunning: false,
                    });
                } else {
                    return task;
                }
            }),
        });
    };
    addTask = (e) => {
        this.setState({
            taskList: [
                ...this.state.taskList,
                { id: uuid(), taskName: e, isFinished: false },
            ],
        });
    };
    deleteTask = (e) => {
        this.setState({
            taskList: this.state.taskList.filter((i) => i.id !== e),
        });
    };
    finishTask = (e) => {
        this.setState({
            taskList: this.state.taskList.map((task) => {
                if (task.id === e) {
                    return Object.assign({}, task, {
                        isFinished: true,
                    });
                } else {
                    return task;
                }
            }),
        });
    };

    render() {
        return (
            <DisplayList
                addTask={this.addTask}
                taskList={this.state.taskList}
                deleteTask={this.deleteTask}
                finishTask={this.finishTask}
                addTime={this.addTime}
                stopTime={this.stopTime}
            />
        );
    }
}

class Timer extends React.Component {
    state = {
        time: { h: 0, m: 0, s: 0 },
        seconds: 0,
        isRunning: false,
    };

    secToTime = (sec) => {
        const s = sec % 60;
        const m = Math.floor((sec % (60 * 60)) / 60);
        const h = Math.floor(sec / 3600);

        this.props.addTime({ h: h, m: m, s: s }, this.props.id);
        return { h: h, m: m, s: s };
    };

    startTimer = () => {
        this.interval = setInterval(() => {
            this.setState({
                seconds: this.state.seconds + 1,
                time: this.secToTime(this.state.seconds),
            });
        }, 1000);
        this.setState({ isRunning: true });
    };

    stopTimer = () => {
        clearInterval(this.interval);
        this.setState({ isRunning: false });
    };

    resetTimer = () => {
        clearInterval(this.interval);
        this.setState({
            time: { h: 0, m: 0, s: 0 },
            seconds: 0,
            isRunning: false,
        });
        this.props.stopTime(this.props.id);
    };

    hideSegment = () => {
        if (this.props.isFinished) return null;
        return (
            <Segment.Group horizontal>
                <Segment
                    textAlign="center"
                    style={{
                        border: 'none',
                        boxShadow: 'none',
                    }}
                >
                    <Button
                        circular
                        onClick={this.startTimer}
                        disabled={this.state.isRunning}
                    >
                        Start
                    </Button>
                </Segment>
                <Segment
                    textAlign="center"
                    style={{
                        border: 'none',
                        boxShadow: 'none',
                    }}
                >
                    <Button
                        circular
                        onClick={this.stopTimer}
                        disabled={!this.state.isRunning}
                    >
                        Pause
                    </Button>
                </Segment>
                <Segment
                    textAlign="center"
                    style={{
                        border: 'none',
                        boxShadow: 'none',
                    }}
                >
                    <Button
                        circular
                        onClick={this.resetTimer}
                        disabled={!this.state.isRunning}
                    >
                        Reset
                    </Button>
                </Segment>
            </Segment.Group>
        );
    };

    render() {
        return (
            <Segment.Group>
                <Segment textAlign="center" size="big">
                    <span>
                        {!this.props.isFinished
                            ? this.state.time.h
                            : this.props.time.h}
                    </span>
                    :
                    <span>
                        {!this.props.isFinished
                            ? this.state.time.m
                            : this.props.time.m}
                    </span>
                    :
                    <span>
                        {!this.props.isFinished
                            ? this.state.time.s
                            : this.props.time.s}
                    </span>
                </Segment>
                {this.hideSegment()}
            </Segment.Group>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <Container>
                <AddTask />
            </Container>
        );
    }
}

export default App;
