/****** Object:  Table [dbo].[passwords]    Script Date: 2021-03-28 10:42:54 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[passwords](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[hashed_password] [nvarchar](128) NOT NULL,
	[created] [datetime] NOT NULL,
	[expired] [datetime] NULL,
	[salt] [nvarchar](128) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[passwords] ADD  DEFAULT (newid()) FOR [id]
GO

ALTER TABLE [dbo].[passwords] ADD  CONSTRAINT [DF_passwords_created]  DEFAULT (getdate()) FOR [created]
GO

ALTER TABLE [dbo].[passwords]  WITH CHECK ADD  CONSTRAINT [FK_passwords_users__user_id_id] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO

ALTER TABLE [dbo].[passwords] CHECK CONSTRAINT [FK_passwords_users__user_id_id]
GO


