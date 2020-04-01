import React, { Component } from "react";
import UserFunds from '../components/Index/UserFunds';
import NewUser from '../components/Index/NewUser';
import Nav from '../components/Shared/Nav';
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";

import TrustlessFundFactory from '../contracts/TrustlessFundFactory.json';

const drizzleOptions = {
  contracts: [
    TrustlessFundFactory
  ], 
  events: {
    TrustlessFundFactory: [
      'CreateFund'
    ]
  }
}

const drizzle = new Drizzle(drizzleOptions);

class Index extends Component {
  render() {
    return (
      <DrizzleContext.Provider drizzle={drizzle}>
        <DrizzleContext.Consumer>
          {drizzleContext => {
            const {drizzle, drizzleState, initialized} = drizzleContext;

            if(!initialized) {
              return "Loading..."
            }

            return(
              <div>
                <Nav drizzle={drizzle} drizzleState={drizzleState} />
                <NewUser drizzle={drizzle} drizzleState={drizzleState} />
                <UserFunds drizzle={drizzle} drizzleState={drizzleState} />
              </div>
            );
          }}
        </DrizzleContext.Consumer>
      </DrizzleContext.Provider>
    );
  }
}

export default Index;
