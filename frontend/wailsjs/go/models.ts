export namespace main {
	
	export class Note {
	    ID: number;
	    Title: string;
	    TabId: number;
	    IsDeleted: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Note(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	        this.TabId = source["TabId"];
	        this.IsDeleted = source["IsDeleted"];
	    }
	}
	export class Tab {
	    ID: number;
	    Title: string;
	
	    static createFrom(source: any = {}) {
	        return new Tab(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Title = source["Title"];
	    }
	}

}

