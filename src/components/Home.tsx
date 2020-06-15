import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';


interface IState {
    search: string,
    customers: any[];
}

export default class Home extends React.Component<RouteComponentProps, IState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { search: '', customers: [] }
    }

    public componentDidMount(): void {
        axios.get(`http://localhost:5000/customers`).then(data => {
            this.setState({ customers: data.data })
        })
    }

    public setSearchResults(): void {
        axios.get(`http://localhost:5000/customers?search=${this.state.search}`).then(data => {
            this.setState({ customers: data.data })
        })
    }

    public deleteCustomer(id: number) {
        axios.delete(`http://localhost:5000/customers/${id}`).then(data => {
            const index = this.state.customers.findIndex(customer => customer.id === id);
            this.state.customers.splice(index, 1);
            this.props.history.push('/');
        })
    }

    private handleInputChanges = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        this.setState({
            search: e.currentTarget.value,
        })
    }

    public render() {
        const customers = this.state.customers;
        return (
            <div>
                {customers.length === 0 && (
                    <div className="text-center">
                        <h2>No customer found at the moment</h2>
                    </div>
                )}

                <div className="container">
                    <div className="row">
                        <div className={"form-wrapper"}>
                            <div className="form-group">
                                <input type="text" id="search" onChange={(e) => this.handleInputChanges(e)} name="search" className="form-control" placeholder="Enter customer's name" />
                                <button className="btn btn-success" type="button" onClick={() => this.setSearchResults}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <table className="table table-bordered">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Firstname</th>
                                    <th scope="col">Lastname</th>
                                    <th scope="col">Date of birth</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers && customers.map(customer =>
                                    <tr key={customer.id}>
                                        <td>{customer.first_name}</td>
                                        <td>{customer.last_name}</td>
                                        <td>{customer.birth}</td>
                                        <td>{customer.phone}</td>
                                        <td>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="btn-group" style={{ marginBottom: "20px" }}>
                                                    <Link to={`edit/${customer.id}`} className="btn btn-sm btn-outline-secondary">Edit Customer </Link>
                                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => this.deleteCustomer(customer.id)}>Delete Customer</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        )
    }
}
