package main

import (
	"context"
)

type App struct {
	ctx context.Context
}

type Settings struct {
	ApiKey string
	Theme string
}

type SubCategory struct {
	Key string
	Name string
	Color string
}

type Category struct {
	Key string
	Name string
	Color string
	Children []SubCategory
}

type Label struct {
	Key string
	Name string
	Color string
}

type QuestionCategory struct {
	Key string
	ParentKey string
}

type QuestionLabel struct {
	Key string
}

type Answer struct {
	Key string
	Description string
	IsCorrect bool
}

type Question struct {
	Key string
	Description string
	HasOneAnswer bool
	Categories []QuestionCategory
	Labels []QuestionLabel
	Answers []Answer
}