import { Route, Switch } from 'wouter';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Brands from './pages/Brands';
import Stylist from './pages/Stylist';
import Community from './pages/Community';
import Products from './pages/Products';
import About from './pages/About';
import Services from './pages/Services';
import SubmitBrand from './pages/SubmitBrand';
import Dashboard from './pages/Dashboard';
import MetaInfo from './pages/MetaInfo';

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/brands" component={Brands} />
        <Route path="/stylist" component={Stylist} />
        <Route path="/community" component={Community} />
        <Route path="/products" component={Products} />
        <Route path="/about" component={About} />
        <Route path="/services" component={Services} />
        <Route path="/submit-brand" component={SubmitBrand} />
        <Route path="/dashboard" component={Dashboard} />
        
        {/* Meta & Info Routes */}
        <Route path="/compare" component={() => <MetaInfo title="Brand Comparison" />} />
        <Route path="/reviews" component={() => <MetaInfo title="Community Reviews" />} />
        <Route path="/orders" component={() => <MetaInfo title="Order Tracking" />} />
        <Route path="/brand-portal" component={() => <MetaInfo title="Brand Portal" />} />
        <Route path="/quality" component={() => <MetaInfo title="Quality Standards" />} />
        <Route path="/contact" component={() => <MetaInfo title="Contact Sales" />} />

        {/* Fallback to Home for other routes mentioned in prompt but not fully implemented yet */}
        <Route path="/:rest*" component={Home} />
      </Switch>
    </Layout>
  );
}
