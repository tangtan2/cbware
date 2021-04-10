/****** Object:  Table [dbo].[web_sessions]    Script Date: 2021-03-28 10:44:10 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[web_sessions](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[created] [datetime] NOT NULL,
	[expired] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[web_sessions] ADD  DEFAULT (newid()) FOR [id]
GO

ALTER TABLE [dbo].[web_sessions] ADD  DEFAULT (getdate()) FOR [created]
GO

ALTER TABLE [dbo].[web_sessions]  WITH CHECK ADD  CONSTRAINT [fk_web_sessions_users__user_id_id] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO

ALTER TABLE [dbo].[web_sessions] CHECK CONSTRAINT [fk_web_sessions_users__user_id_id]
GO


