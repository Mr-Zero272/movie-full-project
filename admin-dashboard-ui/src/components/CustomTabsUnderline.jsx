import React from 'react';
import { Tabs, TabsHeader, Tab, TabsBody, TabPanel } from '@material-tailwind/react';

function CustomTabsUnderline({ data, className }) {
    const [activeTab, setActiveTab] = React.useState(() => data[0].value);
    return (
        <Tabs value={data[0].value} className={className}>
            <TabsHeader
                className="w-fit mb-5 rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                indicatorProps={{
                    className: 'bg-transparent border-b-2 border-yellow-900 shadow-none rounded-none',
                }}
            >
                {data.map(({ label, value, icon }) => (
                    <Tab
                        key={value}
                        value={value}
                        className={activeTab === value ? 'text-yellow-900' : ''}
                        onClick={() => setActiveTab(value)}
                    >
                        <div className="flex items-center gap-2 w-32 justify-center">
                            {/* {React.createElement(icon, { className: 'w-5 h-5' })} */}
                            {label}
                        </div>
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
                {data.map(({ value, content, props }) => (
                    <TabPanel key={value} value={value}>
                        {React.createElement(content, props)}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}

export default CustomTabsUnderline;
