/****** Object:  Table [dbo].[orders]    Script Date: 2021-03-28 10:41:16 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[orders](
	[id] [uniqueidentifier] NOT NULL,
	[part] [varchar](250) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[quantity] [decimal](18, 0) NOT NULL,
	[notes] [text] NULL,
	[placed] [datetime] NOT NULL,
	[completed] [datetime] NULL,
	[completed_notes] [text] NULL,
	[orderer] [varchar](250) NOT NULL,
	[work_order] [varchar](15) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[orders] ADD  DEFAULT (newid()) FOR [id]
GO

ALTER TABLE [dbo].[orders] ADD  CONSTRAINT [DF_orders_placed]  DEFAULT (getdate()) FOR [placed]
GO

ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [fk_orders_parts__part_id_id] FOREIGN KEY([part])
REFERENCES [dbo].[parts] ([name])
GO

ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [fk_orders_parts__part_id_id]
GO

ALTER TABLE [dbo].[orders]  WITH CHECK ADD  CONSTRAINT [fk_orders_users__user_id_id] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO

ALTER TABLE [dbo].[orders] CHECK CONSTRAINT [fk_orders_users__user_id_id]
GO


