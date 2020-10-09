import React from 'react';
import { shallow, mount } from 'enzyme';
import Calendar from './Calendar';


describe('<Calendar />', () => {
    const stubTodos=[
      {id:1, title:"Go Home", year:2020, month:9, date:8, done:true},
      {id:2, title:"SWPP Team Meeting", year:2020, month:9, date:9, done:true},
      {id:3, title:"Take a nap", year:2020, month:9, date:9, done:false},
    ];
    //since here, month 9 is same as October in Date.getMonth function

    it('should render without errors', () => {
      const component = shallow(<Calendar />);
      const wrapper = component.find('Table');
      expect(wrapper.length).toBe(1);
    });

    it('should render dates properly',()=>{
      const component= mount(<Calendar year={2020} month={10} todos={stubTodos}/>);
      const wrapper=component.find('.date');
      expect(wrapper.length).toBe(31);
    });

    it('should handle clicks', () => {
      const mockClickDone = jest.fn();
      const component= mount(<Calendar year={2020} month={10} todos={stubTodos} clickDone={mockClickDone}/>);
      const wrapper = component.find('.todoTitle.notdone');
      expect(wrapper.length).toBe(1);
      wrapper.simulate('click');
      expect(mockClickDone).toHaveBeenCalledTimes(1);
    });
});