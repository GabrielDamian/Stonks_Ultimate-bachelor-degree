import React,{useState,useEffect} from 'react';
import './LeftMenu.css';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { tabsListUnstyledClasses } from '@mui/base';

export default function LeftMenu({tabIndex,setTabs,tabs}){
    console.log("tab index:", tabIndex)
    return(
        <div className='left-bar-container'>
            <div className='left-bar-header'>
                <span>Logo</span>
            </div>
            <VerticalTabs tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
        </div>
    )
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

function VerticalTabs({tabIndex,setTabs,tabs}) {
    console.log("tab index:", tabIndex)

    const navigate = useNavigate();
    
  const [value, setValue] = React.useState(tabIndex);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabs((prev)=>{
        let copy = {...prev}
        copy["selected"] = newValue
        return copy
    })
    console.log("redirect to:", tabs.options[newValue])
    navigate(tabs.options[newValue])
  };

  return (
    <Box
      sx={{ 
        flexGrow: 1, 
        bgcolor: 'background.paper', 
        display: 'flex', 
        height: 'auto',
        border:'1px solid red',
    }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ 
            borderRight: 1, 
            borderColor: 'divider',
            width:'100%'
        }}
      >
        {
            tabs.options.map((el)=>{
                return(
                    <Tab label={el} {...a11yProps(0)} />
                )
            })
        }
        {/* <Tab label="Item One" {...a11yProps(0)} />
        <Tab label="Item Two" {...a11yProps(1)} />
        <Tab label="Item Three" {...a11yProps(2)} />
        <Tab label="Item Four" {...a11yProps(3)} />
        <Tab label="Item Five" {...a11yProps(4)} />
        <Tab label="Item Six" {...a11yProps(5)} />
        <Tab label="Item Seven" {...a11yProps(6)} /> */}
      </Tabs>
      {/* <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel> */}
    </Box>
  );
}