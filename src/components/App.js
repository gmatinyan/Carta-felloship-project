import React, { Component } from 'react';
import '../App.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function formatShares(value){
    return Number(value).toLocaleString('en');
}

function formatCurrency(value){
    return Number(value).toLocaleString('en-US', {
                                         style: 'currency',
                                         currency: 'USD' });
}

function calculateSum (arr){
  return arr.reduce(function(a, item){
    return a + item.cost.$
  }, 0);
}

function calculateQuantity (arr){
  return arr.reduce(function(a, item){
    return a + item.quantity
  }, 0);
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            investments: [],
            isLoaded: false,
            showAssets : {},
            date: new Date(),

        }
        this.onShowAssetsClick = this.onShowAssetsClick.bind(this);
        this.onDateChange = this.onDateChange.bind(this);

    }

    componentDidMount() {
        const url = "https://gist.githubusercontent.com/cranium/d8b83184bf0750f2c834760b7c9203dc/raw/a73a70716951f77b90e84b8848ff1fee46938dd1/soi.json"
        fetch(url)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    investments: json,
                    showAssets: {}
                })
            });
    }


    onShowAssetsClick(id) {
        let showAssets = this.state.showAssets
        showAssets[id] = !Boolean(this.state.showAssets[id])
        this.setState({
            showAssets: showAssets
        });
    }

    onDateChange(date) {
        this.setState({
            date: date
        });
    }

    getFilteredAssets(assets){
        return assets.filter(asset => {
            return this.state.date > new Date(asset.investment_date)
        })
    }

    getTotalCost(investments) {
        let total = 0;
        investments.forEach(investment => {
            investment.issued_assets.forEach(asset => {
                if(this.state.date > new Date(asset.investment_date)) {
                    total += asset.cost.$
                }
            })
        })
        return total
    }

    renderInvestment(investment) {
        const assets = this.getFilteredAssets(investment.issued_assets)

        if (assets.length === 0) {
            return
        }
        
        const buttonText = this.state.showAssets[investment.id] ? 'Hide assets' : 'Show assets';
        return (
            <React.Fragment key={investment.id}>
            <tr><td className='separator' colSpan='5'>&nbsp;</td></tr>
            <tr className="rowStyling">
                <td >{investment.name}</td>
                <td colSpan="2"><button onClick={() => this.onShowAssetsClick(investment.id)}>{buttonText}</button></td>
                <td className="rightAlign">{formatShares(calculateQuantity(assets))}</td>
                <td className="rightAlign">{ formatCurrency(calculateSum(assets))}</td>
            </tr>
            
            {this.state.showAssets[investment.id] && assets.map(asset =>(
                <tr key={asset.id}>
                    <td></td>
                    <td className="leftAlign">{asset.asset_class}</td>
                    <td className="leftAlign">{asset.investment_date}</td>
                    <td className="rightAlign">{formatShares(asset.quantity)}</td>
                    <td className="rightAlign">{formatCurrency(asset.cost.$)}</td>
                </tr>
            ))}
            </React.Fragment>

            
        );
    }
    
    render() {        

        let { isLoaded, investments } = this.state;

        if (!isLoaded) {
            return <div> loading ... </div>
        } 
        else{
            return (
                <div className="App">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan="5" className="leftAlign">
                                    Krakatoa Ventures Fund I, L.P. <br/>
                                    As of 
                                    <DatePicker
                                        selected={this.state.date}
                                        onChange={this.onDateChange}
                                        popperPlacement="top"
                                        style={{width: 200, marginHorizontal: 10}}
                                    />.
                                    Generated by Fred Admin'strator(admin@esharesinc.com) 
                                                                      at 11/19/2018 11:58:23
                                                                      
                                </th>
                            </tr>
                            <tr>
                                <th width='30%' className="leftAlign">Investment</th>
                                <th width='30%' className="leftAlign">Asset</th>
                                <th width='15%' className="leftAlign">Investment date</th>
                                <th width='10%' style={{textAlign: 'right'}}>Shares</th>
                                <th width='15%' style={{textAlign: 'right'}}>Cost</th>
                            </tr>                            
                        </thead>
                        <tbody>
                            {investments.map((investment) => this.renderInvestment(investment))}   
                        </tbody>
                        <tfoot>
                            <tr><td className='separator' colSpan='5'>&nbsp;</td></tr>
                            <tr className="rowStyling">
                                <td colSpan="4" >Total</td>
                                <td className="rightAlign">{formatCurrency(this.getTotalCost(investments))}</td>
                            </tr>
                        </tfoot>
                    </table>  
                </div>
            ); 
        }
        
    }
}

export default App;
