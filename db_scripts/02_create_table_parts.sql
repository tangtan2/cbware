/****** Object:  Table [dbo].[parts]    Script Date: 2021-03-28 10:42:20 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[parts](
	[name] [varchar](250) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[name] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


