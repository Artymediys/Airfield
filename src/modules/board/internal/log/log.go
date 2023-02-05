package log

import (
	"os"
	"strings"

	"golang.org/x/exp/slog"
)

const (
	dateFormat     = "02.01.2006 15:04:05 MST"
	moduleLocation = "board/"
)

func New() *slog.Logger {
	l := slog.New(slog.HandlerOptions{
		AddSource:   true,
		ReplaceAttr: replacer,
	}.NewTextHandler(os.Stderr))

	return l
}

// replacer is a function that replaces slog.Attr values with human-readable values.
func replacer(_ []string, a slog.Attr) slog.Attr {
	// Format time to a human-readable format.
	if a.Key == slog.TimeKey {
		a.Value = slog.StringValue(a.Value.Time().Format(dateFormat))
	}

	// Format source to a human-readable format.
	if a.Key == slog.SourceKey {
		// remove prefix until 'board/'
		idx := strings.Index(a.Value.String(), moduleLocation)
		if idx == -1 {
			idx = 0
		}

		a.Value = slog.StringValue(a.Value.String()[idx:])
	}

	return a
}
