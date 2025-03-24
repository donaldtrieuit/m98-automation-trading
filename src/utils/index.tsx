export * from './variable';
export * from './contants';
export * from './file';
export * from './helper';

export const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function createStorage(key: string) {
	const store = JSON.parse(window.localStorage.getItem(key) || '{}');
	const save = () => {
		window.localStorage.setItem(key, JSON.stringify(store));
	};
	return {
		get(key: string | number) {
			return store[key];
		},
		set(key: string | number, value: any) {
			store[key] = value;
			save();
		},
		remove(key: string | number) {
			delete store[key];
			save();
		},
	};
}

export const layoutStorage = createStorage('layout');
export const localstorageTypes = {
	collapsedLayout: 'collapsed_layout',
};
