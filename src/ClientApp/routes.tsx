import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { JobDetail } from './components/JobDetail';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route exact path='/jobdetail/:jobName' component={JobDetail} />
</Layout>;
