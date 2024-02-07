import { Tabs, TabsHeader, Tab, TabsBody, TabPanel } from '@material-tailwind/react';
import React from 'react';

function CustomTabs({ data }) {
    return (
        <Tabs value={data[0].value}>
            <TabsHeader>
                {data.map(({ label, value, icon }) => (
                    <Tab key={value} value={value}>
                        <div className="flex items-center gap-2">
                            {React.createElement(icon, { className: 'w-5 h-5' })}
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

export default CustomTabs;
