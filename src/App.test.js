import '../setupTests';

import { mount, shallow } from 'enzyme';
import React from 'react';

import App, { Todo, TodoForm, useTodos } from './App';

// Enzyme.configure({ adaptetr: new Adapter() });

describe('App', () => {
  describe('Todo', () => {
    it('ejecuta completeTodo cuando clickeo Complete', () => {
      const comepleteTodo = jest.fn(); // con esto creo un mock ( funcion que me muestra info sobre su interaccion)
      const removeTodo = jest.fn();
      const index = 5;
      const todo = {
        isCompleted: false,
        text: 'lala',
      };
      //Renderizamos una copia vacia del componente, nada de hijos
      const wrapper = shallow(
        <Todo
          completeTodo={comepleteTodo}
          removeTodo={removeTodo}
          index={index}
          todo={todo}
        />
      );
      //Buscamos el boton 0 (el primero) y le damos click
      wrapper.find('button').at(0).simulate('click');
      // mock.calls nos da un arreglo de las llamadas de la funcion y  un arreglo de sus argumentos
      // [ [5, 1], [5] ] significa, dos llamada con un argumento de valor 5,1 y otro de valor 5
      expect(comepleteTodo.mock.calls).toEqual([[5]]);
      //aca preguntamos que no tenga ejecuciones
      expect(removeTodo.mock.calls).toEqual([]);
    });

    it('ejecuta removeTodo cuando clickeo Remover', () => {
      const comepleteTodo = jest.fn(); // con esto creo un mock ( funcion que me muestra info sobre su interaccion)
      const removeTodo = jest.fn();
      const index = 5;
      const todo = {
        isCompleted: false,
        text: 'lala',
      };
      //Creamos una copia vacia del componente (swallow), nada de hijos
      const wrapper = shallow(
        <Todo
          completeTodo={comepleteTodo}
          removeTodo={removeTodo}
          index={index}
          todo={todo}
        />
      );
      //Buscamos un boton, (en) la posicion 0 de la lista de botones y (simulamos) un click con el event nativo
      wrapper.find('button').at(1).simulate('click');
      // mock.calls nos da un arreglo de las llamadas de la funcion y  un arreglo de sus argumentos
      // [ [5, 1], [5] ] significa, dos llamada con un argumento de valor 5,1 y otro de valor 5
      expect(removeTodo.mock.calls).toEqual([[5]]);
      expect(comepleteTodo.mock.calls).toEqual([]);
    });

    describe('TodoForm', () => {
      it('LLenamos input -> submit y ejecutamos addTodo si hay un valor', () => {
        const addTodo = jest.fn();
        const wrapper = shallow(<TodoForm addTodo={addTodo} />);
        //Simulamos un change nativo y le pasamos el valor (e.target.value), este modificara el state
        wrapper
          .find('input')
          .simulate('change', { target: { value: 'nuevoTodo' } });
        //Simulamos un submit nativo y le pasamos una funcion que no testearemos, pero la necesitamos
        //parar para evitar errores, ( preventDefault)
        wrapper.find('form').simulate('submit', { preventDefault: () => {} });
        //Revisamos el value en el state
        expect(addTodo.mock.calls).toEqual([['nuevoTodo']]);
      });
    });

    describe('custom hook: useTodos', () => {
      it('addTodo', () => {
        //Para llamar un hook, necesitamos meterlo en un componente de prueba
        const Test = (props) => {
          const hook = props.hook();
          return <div {...hook} />;
        };

        const wrapper = shallow(<Test hook={useTodos} />);
        //nos enchufamos a los props que le pasamos a nuestro componente ( props = el hook)
        let testProps = wrapper.find('div').props();
        testProps.addTodo('Texto de prueba');
        //actualizamos la data que tenemos, re asignando lo que retorna el hook
        testProps = wrapper.find('div').props();
        expect(testProps.todos[0]).toEqual({ text: 'Texto de prueba' });
      });
      it('completeTodo', () => {
        const Test = (props) => {
          const hook = props.hook();
          return <div {...hook} />;
        };
        const wrapper = shallow(<Test hook={useTodos} />);
        let testProps = wrapper.find('div').props();
        testProps.completeTodo(0);
        testProps = wrapper.find('div').props();
        expect(testProps.todos[0]).toEqual({
          text: 'Todo 1',
          isCompleted: true,
        });
      });

      it('removeTodo', () => {
        const Test = (props) => {
          const hook = props.hook();
          return <div {...hook} />;
        };
        const wrapper = shallow(<Test hook={useTodos} />);
        let testProps = wrapper.find('div').props();
        const todosLength = testProps.todos.length;
        testProps.removeTodo(todosLength - 1);
        testProps = wrapper.find('div').props();
        expect(testProps.todos[todosLength - 1]).toBeUndefined();
      });
    });

    describe('App integrada', () => {
      it('Adding todo in App', () => {
        //Renderizamos INCLUYENDO los hijos, no es como shallow
        const wrapper = mount(<App />);
        const preventDefaultMock = jest.fn(); // Para el prevent del form
        wrapper
          .find('input')
          .simulate('change', { target: { value: 'new todo' } });
        wrapper
          .find('form')
          .simulate('submit', { preventDefault: preventDefaultMock });
        const respuesta = wrapper
          .find('.todo') // buscamos por className
          .at(0)
          .text() // Convertimos todo el componente a un string
          .includes('new todo');
        expect(respuesta).toEqual(true);
        expect(preventDefaultMock.mock.calls).toEqual([[]]);
      });
    });
  });
});
