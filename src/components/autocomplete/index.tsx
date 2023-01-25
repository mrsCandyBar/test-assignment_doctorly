import React from 'react';
import {
    Container, Row, Col,
    FormGroup, Label, Input,
    InputGroup,
    Button,
    ListGroup, ListGroupItem
} from 'reactstrap';

interface IAutoCompleteProps {
    children?: any;
}
interface IAutoCompleteState { }

class AutoComplete extends React.Component<IAutoCompleteProps, IAutoCompleteState> {
    constructor(props: IAutoCompleteProps) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <React.Fragment>
                <h1>Autocomplete Widget</h1>

                <Row>
                    <Col md="12">
                        <div className={`siteSearch`}>

                            {/* Search Form */}
                            <Row form className='form-row'>
                                <Col className="mt-3 pl-0">
                                    <InputGroup>
                                        <Input
                                            type="text"
                                            name="search"
                                            id="searchForMedication"
                                            placeholder="Search"
                                        />
                                        <Button color='link' style={{ background: "#ffffff" }}>x</Button>
                                        <Button>Search</Button>
                                    </InputGroup>
                                </Col>
                            </Row>

                            {/* Suggested Search terms */}
                            <Row>
                                <Col>
                                    <p className="mt-2 mb-4 mt--1">
                                        <small>
                                            Related Searches :&nbsp;&nbsp;
                                            <Button color="primary" className='m-1'>Search Result 01</Button>
                                            <Button color="primary" className='m-1'>Search Result 02</Button>
                                            <Button color="primary" className='m-1'>Search Result 03</Button>
                                        </small></p>
                                </Col>
                            </Row>

                            {/* Returned Search Results */}
                            <Row className='m-0 p-0'>
                                <Col className='m-0 p-0'>
                                    <p className="p-2 m-0">
                                        <big>
                                            <b>Filter entries by:</b>
                                        </big>
                                    </p>

                                    <Row className="p-2 m-0">
                                        <Col>
                                            <Button className='m-1'>strength</Button>
                                            <Button className='m-1'>name</Button>
                                            <Button className='m-1'>amount</Button>
                                        </Col>
                                    </Row>

                                    <ListGroup>
                                        <ListGroupItem onClick={() => console.log("Click for more info")}>
                                            <p>
                                                <small>pzn number</small><br />
                                                <big>medication name</big><br />

                                                <span>Strength: 200 unit</span><br />
                                                <span>Amount: amountValue amountUnit</span>
                                            </p>
                                        </ListGroupItem>
                                    </ListGroup>

                                    <p className='m-0 p-2'><small>No search results found. Try another search term</small></p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </React.Fragment >
        );
    }
};

export default AutoComplete;