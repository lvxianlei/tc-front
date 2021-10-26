import { History, Location } from 'history';

export interface RouteProps {
	history: History;
	location: Location;
	match: any;
	route: any;
}