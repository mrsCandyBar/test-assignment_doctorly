import React from 'react';
import {
    Row, Col,
    Input,
    InputGroup,
    Button,
    ListGroup, ListGroupItem
} from 'reactstrap';
import { set } from 'lodash';
import { medication } from './data';

interface IAutoCompleteProps {
    children?: any;
}
interface IAutoCompleteState {
    searchInput: string;
    searchEntries: Promise<any>;
    matchSearchEntries: Array<any>;
    matchSearchTerms: Array<string>;
    isSearching: boolean;
}

class AutoComplete extends React.Component<IAutoCompleteProps, IAutoCompleteState> {
    constructor(props: IAutoCompleteProps) {
        super(props);
        this.state = {
            searchInput: "",
            searchEntries: AutoComplete.getSearchEntries() || [],
            matchSearchEntries: [],
            matchSearchTerms: [],
            isSearching: true
        }
    }

    static getSearchEntries = () => {
        const randomizeTimeout = Math.random() * 1000;
        return new Promise((resolve) => {
            setTimeout(() => {
              resolve(medication);
            }, randomizeTimeout);
          });
    }

    public onChange = (event: any) => {
        const newState = this.state;
        const target = event && event.currentTarget ? event.currentTarget : event.target;
        const targetValue = target.type === 'checkbox' ? target.checked : target.value;
        set(newState, target.name, targetValue);
        this.setState(newState);
    }

    render() {
        let {
            searchInput,
            matchSearchEntries,
            matchSearchTerms,
        } = this.state;

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
                                                name="searchInput"
                                                id={searchInput}
                                                onChange={(event: any) => this.onChange(event)}
                                                placeholder="Search"
                                            />
                                            <Button color='link' style={{
                                                position: "absolute",
                                                right: "80px",
                                                zIndex: 10,
                                            }}>x</Button>
                                        <Button>Search</Button>
                                    </InputGroup>
                                </Col>
                            </Row>


                            {(searchInput.length > 0) && (
                                <>
                                    {/* Suggested Search terms */}
                                    {(matchSearchTerms.length > 0) && (
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
                                    )}

                                    {/* Returned Search Results */}
                                    {(matchSearchEntries.length > 0) && (
                                        <Row className='m-0 p-0'>
                                            <Col className='m-0 p-0'>
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
                                    )}
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </React.Fragment >
        );
    }
};

export default AutoComplete;