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

        // Filter data by form input
        this._updateSearchEntries(event.currentTarget.value);
    }

    public _updateSearchEntries = (value: string, selectedFilter?: string) => {
        const valueCheck = value.toLowerCase();
        let updateMatchList: any = [];
        let updateMatchTermList: any = {};
        //if (this.state.searchEntries && this.state.searchEntries.length > 0) {
        if (medication.length > 0) {
            //let allEntries:any = [ ...this.state.searchEntries];
            let allEntries: any = [...medication];
            allEntries.map((entry: any) => {
                let matchFound: boolean = false;
                let prepData: any = false;
                prepData = this._prepAndReturnWantedData(entry, valueCheck, updateMatchTermList);
                matchFound = prepData.found;
                updateMatchTermList = prepData.matchList
                if (matchFound === true) {
                    updateMatchList = updateMatchList.length > 0 ? [...updateMatchList, entry] : [entry];
                }
                return entry;
            });
        }

        this.setState({
            matchSearchEntries: updateMatchList,
            matchSearchTerms: Object.keys(updateMatchTermList)
        });
    }

    public _prepAndReturnWantedData = (data: any, selectedTerm: string, matchTermList: any) => {
        let isViable = false;
        if (typeof (data.name) === "string" && data.name.toLowerCase().indexOf(selectedTerm) !== -1) {
            isViable = true;
            if (data.name.toLowerCase().length !== selectedTerm.length) {
                matchTermList[data.name.toLowerCase()] = "true";
            }
        }
        return { found: isViable, matchList: matchTermList };
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
                                                    {matchSearchEntries.map((entry: any) => {
                                                        return (
                                                            <ListGroupItem onClick={() => console.log("Click for more info")}>
                                                                <p>
                                                                    <small>{entry.pzn}</small><br />
                                                                    <big>{entry.name}</big><br />

                                                                    <span>Strength: {entry.strengthValue} {entry.strengthUnit}</span><br />
                                                                    <span>Amount: {entry.amountValue} {entry.amountUnit}</span>
                                                                </p>
                                                            </ListGroupItem>
                                                        )
                                                    })}

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