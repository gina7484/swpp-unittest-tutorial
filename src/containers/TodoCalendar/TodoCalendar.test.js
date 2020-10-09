import React, { Component } from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter } from 'connected-react-router';
import { Route, Redirect, Switch } from 'react-router-dom';
import { getMockStore } from '../../test-utils/mocks';
import { history } from '../../store/store';
import * as actionCreators from '../../store/actions/todo';
import { Table } from 'semantic-ui-react'

import TodoCalendar from './TodoCalendar';


const CALENDAR_HEADER = (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell className="sunday">Sun</Table.HeaderCell>
        <Table.HeaderCell>Mon</Table.HeaderCell>
        <Table.HeaderCell>Tue</Table.HeaderCell>
        <Table.HeaderCell>Wed</Table.HeaderCell>
        <Table.HeaderCell>Thu</Table.HeaderCell>
        <Table.HeaderCell>Fri</Table.HeaderCell>
        <Table.HeaderCell>Sat</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  );

//mock child component
jest.mock('../../components/Calendar/Calendar',()=>{
    return jest.fn(props=>{
        return (
            <div className="spyCalendar"/>
        );
    });
});

//stub redux store
const stubInitialState={
    todos: [
        {id:1, title:"TDCAL_TEST_TITLE1", content:"TDCAL_TEST_CONTENT1", year:2020, month:9, date:8, done:true},
        {id:2, title:"TDCAL_TEST_TITLE2", content:"TDCAL_TEST_CONTENT2", year:2020, month:9, date:9, done:true},
        {id:3, title:"TDCAL_TEST_TITLE3", content:"TDCAL_TEST_CONTENT3", year:2020, month:9, date:9, done:false},
    ],
    selectedTodo: null,
}

const mockStore=getMockStore(stubInitialState);


describe('<TodoCalendar />', () => {
    let todoCalendar, spyGetTodos;
    beforeEach(()=>{
        todoCalendar=(
            <Provider store={mockStore}>
            <ConnectedRouter history={history}>
            <Switch>
              <Route path='/' exact
                render={() => <TodoCalendar />} />
            </Switch>
            </ConnectedRouter>
          </Provider>
    
        );
        spyGetTodos = jest.spyOn(actionCreators, 'getTodos')
        .mockImplementation(() => { return dispatch => {}; });  
    });
    afterEach(() => { jest.clearAllMocks() });

    it('should render without errors', () => {
        const component = mount(todoCalendar);
        const wrapper = component.find('.spyCalendar');
        expect(wrapper.length).toBe(1);
        expect(spyGetTodos).toBeCalledTimes(1);
    });
/*
      <div>
        <div className="link"><NavLink to='/todos' exact>See TodoList</NavLink></div>
        <div className="header">
          <button onClick={this.handleClickPrev}> prev month </button>
          {this.state.year}.{this.state.month}
          <button onClick={this.handleClickNext}> next month </button>
        </div>
        <Calendar
          year={this.state.year}
          month={this.state.month}
          todos={this.props.storedTodos}
          clickDone={this.props.onToggleTodo}/>
      </div>
*/
    it('should call handleClickPrev if month !== 1', () => {
        const component = mount(todoCalendar);
        const wrapper = component.find('button').at(0);
        wrapper.simulate('click');
        const todoCalendarInstance = component.find(TodoCalendar.WrappedComponent).instance();
        expect(todoCalendarInstance.state.year).toBe(2019);
        expect(todoCalendarInstance.state.month).toBe(9);
    });  
    it('should call handleClickPrev if month === 1', () => {
		const component = mount(todoCalendar);
		const wrapper = component.find('button').at(0);
        wrapper.simulate('click');//9
        wrapper.simulate('click');//8
        wrapper.simulate('click');//7
        wrapper.simulate('click');//6
        wrapper.simulate('click');//5
        wrapper.simulate('click');//4
        wrapper.simulate('click');//3
        wrapper.simulate('click');//2
        wrapper.simulate('click');//1
        wrapper.simulate('click');//0
		const todoCalendarInstance = component.find(TodoCalendar.WrappedComponent).instance();
		expect(todoCalendarInstance.state.year).toBe(2018);
		expect(todoCalendarInstance.state.month).toBe(12);
    });
    it('should call handleClickNext if month !== 12', () => {
		const component = mount(todoCalendar);
		const wrapper = component.find('button').at(1);
		wrapper.simulate('click');
		const todoCalendarInstance = component.find(TodoCalendar.WrappedComponent).instance();
		expect(todoCalendarInstance.state.year).toBe(2019);
		expect(todoCalendarInstance.state.month).toBe(11);
	});
	it('should call handleClickNext if month === 12', () => {
		const component = mount(todoCalendar);
		const wrapper = component.find('button').at(1);
        wrapper.simulate('click');//11
        wrapper.simulate('click');//12
        wrapper.simulate('click');//1
		const todoCalendarInstance = component.find(TodoCalendar.WrappedComponent).instance();
		expect(todoCalendarInstance.state.year).toBe(2020);
		expect(todoCalendarInstance.state.month).toBe(1);
	});
});