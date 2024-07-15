import "primereact/resources/themes/arya-purple/theme.css";
import { Card } from 'primereact/card';
        



export default function App() {

  return (
    <div>
      <Card className="primaryStatContainer">
        <Card title="Total Requests" className="primaryStat">
          <p>0</p>
        </Card>
        <Card title="Total Errors" className="primaryStat">
          <p>0</p>
        </Card>
        <Card title="Avg Response Time" className="primaryStat">
          <p>0</p>
        </Card>
        <Card title="Date" className="primaryStat">
          <p>0</p>
        </Card>
      </Card>

    </div>
  )
}