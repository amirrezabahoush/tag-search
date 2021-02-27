import React, { useState } from 'react';
import { AutoComplete, Input, Typography, Row, Col, message, Button, Form } from 'antd';
import './App.css';
import api from './utils/api';
import parse from 'html-react-parser';


const { TextArea } = Input;
const { Title } = Typography;

const App = () => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');

  const handleSearch = (value) => {
    const values = value.split(' ');
    const currentTypedValue = values[values.length - 1];
    if (currentTypedValue.includes('#')) {
      const typedText = currentTypedValue.slice(1);
      api('tag', 'GET', null, { type: 'tag', tag: typedText }).then(response => {
        const options = [];
        response.data.list.map(item => {
          options.push({ value: parse(item) });
        })
        setOptions(options);
      })
    }
  };

  const onSelect = (value) => {
    const selectedVal = `${value[0].props.children}${value[1]}`
    message.info(`your selected item is: ${selectedVal}`)
  };

  const onChange = value => {
    if (Array.isArray(value)) {
      console.log(value, "value");
      const lettersArray = [];
      value.filter((item, index) => {
        typeof item === 'object' &&
          lettersArray.push(index);
        return '';
      }
      );
      let selectedVal;
      lettersArray.map(item => {
        switch (item) {
          case 0:
            selectedVal = `${value[0].props.children}${value[1]}`;
            break;
          case 1:
            selectedVal = `${value[0]}${value[1].props.children}${value[2] || ''}`;
            break;
          case 2:
            selectedVal = `${value[0].props.children}${value[1]}${value[2].props.children}`;
            break;
          default:
            selectedVal = `${value[0]}${value[1].props.children}${value[2]}${value[3].props.children}`;
        }
      });
      setSelectedValue(prevValue => {
        const values = prevValue.split(' ');
        values.map((item, index) => {
          item.includes('#') && values.splice(index, 1);
          return true;
        });
        const newValues = values.join('');
        return `${newValues} #${selectedVal}`
      });
    } else {
      setSelectedValue(value);
    }
  }

  const onSend = () => {
    const formdata = [
      {
        "key": "type",
        "value": "save",
        "type": "text"
      },
      {
        "key": "description",
        "value": selectedValue,
        "type": "text"
      }
    ]
    // const formdata = new FormData(data);
    api('tag', 'POST', { data: formdata }).then(response => {
      message.success('Saved Successfully!');
    })
  }

  return (
    <>
      <Row justify='center' className='hashArea__title'>
        <Col xs={4}>
          <Title>Hash Select</Title>
        </Col>
      </Row>
      <Form>
        <Row justify='center'>
          <Col xs={4} className='flex-column'>
            <AutoComplete
              options={options}
              className='w-100'
              onSelect={onSelect}
              onSearch={handleSearch}
              onChange={onChange}
              value={selectedValue}
            >
              <TextArea
                placeholder="input here"
                className="custom"
                value={selectedValue}
              />
            </AutoComplete>
            <div className='flex-row mt-24'>
              <Button className='ml-10' type="primary" onClick={onSend}>Send</Button>
              <Button className='ml-10'>Clear</Button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default App;