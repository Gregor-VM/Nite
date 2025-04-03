package main

// data.json
type Block struct {
	ID    string                 `json:"id"`
	Type  string                 `json:"type"`
	Value []ValueItem            `json:"value"`
	Meta  map[string]interface{} `json:"meta"`
}
type ValueItem struct {
	ID       string      `json:"id"`
	Type     string      `json:"type"`
	Props    *Props      `json:"props,omitempty"`
	Children []ChildText `json:"children"`
}
type Props struct {
	Src      string    `json:"src"`
	Alt      string    `json:"alt"`
	SrcSet   *string   `json:"srcSet"`
	BgColor  *string   `json:"bgColor"`
	Fit      string    `json:"fit"`
	Sizes    ImageSize `json:"sizes"`
	NodeType string    `json:"nodeType"`
}
type ImageSize struct {
	Width  int `json:"width"`
	Height int `json:"height"`
}
type ChildText struct {
	Text string `json:"text"`
}
