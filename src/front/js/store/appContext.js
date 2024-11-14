import React, { useState, useEffect, useContext } from "react";
import getState from "./flux.js";

// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);

// Custom hook to access the store
export const useStore = () => useContext(Context);

// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		// this will be passed as the context value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: { ...state.store, ...updatedStore },  // Improved store merging
						actions: { ...state.actions }
					})
			})
		);

		useEffect(() => {
			/**
			 * Verify token on load to check if the user is logged in.
			 * If the user has a valid token, the authentication state will be updated.
			 **/
			state.actions.verifyToken();
		}, []);  // Empty array means this will run only once after the component mounts.

		// The initial value for the context is not null anymore, but the current state of this component,
		// the context will now have a getStore, getActions and setStore functions available, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
